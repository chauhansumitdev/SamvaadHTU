require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const twilio = require('twilio');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/images', express.static('images'));
app.use(cors({
  origin: '*',
}));

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  },
});

const upload = multer({ storage: storage });

const imageSchema = new mongoose.Schema({
  url: String,
});

const commentSchema = new mongoose.Schema({
  content: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  images: [imageSchema],
  comments: [commentSchema],
  location: String,  
});

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  adhaarnumber: String,
  mobilenumber: String,
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  posts: [postSchema],
});

const User = mongoose.model('User', userSchema);

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const tokenParts = token.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  const jwtToken = tokenParts[1];

  jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.userId = decoded.userId;
    next();
  });
};


app.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, adhaarnumber, mobilenumber, username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstname,
      lastname,
      adhaarnumber,
      mobilenumber,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '90d' });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.get('/home', async (req, res) => {
  try {
    const allPosts = await User.find({}, { _id: 0, password: 0, __v: 0, posts: { $slice: -5 } })
      .select('username posts')
      .populate({
        path: 'posts',
        select: 'title content location',
        populate: {
          path: 'images',
          select: 'url',
        },
      })
      .exec();

    const postsWithImagesAndUsername = allPosts.map(user => ({
      username: user.username,
      posts: user.posts,
    })).flat();

    res.status(200).json({ posts: postsWithImagesAndUsername });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





app.post('/create-post', verifyToken, upload.array('images'), async (req, res) => {
  try {
    const { title, content, location } = req.body;
    const images = req.files.map(file => ({ url: file.filename }));

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const newPost = { title, content, images, location };
    user.posts.push(newPost);
    await user.save();

    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/create-comment/:postId', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const post = user.posts.id(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newComment = { content, user: req.userId };
    post.comments.push(newComment);
    await user.save();

    res.status(201).json({ message: 'Comment created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/get-comments/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;

    const postWithComments = await User.findOne({ 'posts._id': postId })
      .select('posts.$')
      .populate({
        path: 'posts.comments',
        select: 'content',
      })
      .exec();

    if (!postWithComments) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comments = postWithComments.posts[0].comments;

    res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/profile', verifyToken, async (req, res) => {
  try {
    const userPosts = await User.findById(req.userId)
      .select('posts') 
      .populate({
        path: 'posts',
        select: 'title content images',
        populate: {
          path: 'images',
          select: 'url',
        },
      })
      .exec();

    res.status(200).json({ posts: userPosts.posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const formSchema = new mongoose.Schema({
  title: String,
  fields: [
    {
      label: String,
      type: {
        type: String,
        enum: ['text', 'checkbox'],
      },
    },
  ],
  submissions: [mongoose.Schema.Types.Mixed],
});

const Form = mongoose.model('Form', formSchema);

app.post('/submit-form/:formId', async (req, res) => {
  try {
    const formId = req.params.formId;
    const formData = req.body;

    const updatedForm = await Form.findOneAndUpdate(
      { _id: formId },
      { $push: { submissions: formData } },
      { new: true }
    );

    res.status(201).json(updatedForm);
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/forms/:formId', async (req, res) => {
  try {
    const formId = req.params.formId;
    const form = await Form.findById(formId);
    res.status(200).json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/submit-form', async (req, res) => {
  try {
    const formData = req.body;
    const newForm = await Form.create(formData);
    res.status(201).json(newForm);
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/forms', async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const notificationSchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);

app.post('/notifications', async (req, res) => {
  try {
    const { message } = req.body;
    const newNotification = new Notification({ message });
    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const yourFormSchema = new mongoose.Schema({
  applicationName: String,
  reportingOnBehalfOf: String,
  location: String,
  typeOfReport: String,
  time: String,
  date: String,
  description: String,
});

const YourFormModel = mongoose.model('YourFormModel', yourFormSchema);

app.post('/submit-your-form', async (req, res) => {
  try {
    const formData = req.body;
    const newForm = new YourFormModel(formData);
    await newForm.save();
    res.status(201).json({ message: 'Your form submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/chatbot', (req, res) => {
  const userText = req.body.text.toLowerCase();

  function reportPalace() {
    return `Here is the detailed process on how to fill a detailed feedback form. \n
Step 1: Click on the file a report icon.
Step 2: Write your name in the applicant name.
Step 3: Write the name of the community or group if you are filing the 
report on behalf of a group/community/company/society, etc.
Step 4: Enter the type of report which in your case is a nuisance report.
Step 5: Enter the location of the palace.
Step 6: Enter the date and time violations.
Step 7: Enter the complete description about the violations i.e. about the location of the palace and previous violations. 
Step 8: Upload any related image or video.
Step 9: Click on next to get a preview of your file.
Step 10: Click on the EDIT button if you want to edit something or click on SUBMIT button to submit the report.`;
  }
  
  function lostDrivingLicense() {
    return `Here is what you can do:
Option 1: You can visit your nearest police station and ask them to file an FIR for your lost passport and give you a photocopy of the report.
Option 2: You can file an online report and download it once it's approved.
Step 1: Click on the (icon ki picture) file a report icon.
Step 2: Write your name in the applicant name.
Step 3: Write the name of the community or group if you are filing the 
report on behalf of a group/community/company/society, etc.
Step 4: Enter the type of report which in your case is a lost report of personal belonging.
Step 5: Enter the assumed location of the place where you lost your driving license.
Step 6: Enter the date and time domain when you lost your driving license.
Step 7: Enter the complete description about your passport i.e. how it looked, or any other marks or features that it may have. 
Step 9: Click on next to get a preview of your filed report.
Step 10: Click on the EDIT button if you want to edit something or click on SUBMIT button to submit the report.
Step 11: Once the report is reviewed by our system, you can download it by simply clicking on the “My profile icon” and then clicking on “Filed reports section”.`;
  }

  function greet(){
    return `Greetings, I am here to assist you. How can I help you today?`;
  }
  

  if (userText.includes('report')) {
    res.json(reportPalace());
  } else if (userText.includes('lost license')) {
    res.json(lostDrivingLicense());
  } else if (userText.includes('hi')) {
    res.json(greet());
  } else if (userText.includes('hello')) {
    res.json(greet());}
    else {
    res.json("I am sorry, I didn't understand that. How can I assist you today?");
  }
});


const emergencySchema = new mongoose.Schema({
  emergencyType: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
  },
});

const Emergency = mongoose.model('Emergency', emergencySchema);

app.post('/submit-emergency', async (req, res) => {
  try {
    const { emergencyType, contactNumber, registrationNumber } = req.body;
    const newEmergency = new Emergency({
      emergencyType,
      contactNumber,
      registrationNumber,
    });
    await newEmergency.save();
    res.status(201).json({ message: 'Emergency data submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/stats', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const emergencyAlertCount = await Emergency.countDocuments();
    const reportCount = await YourFormModel.countDocuments();

    res.json({
      userCount,
      emergencyAlertCount,
      reportCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/combinedData', async (req, res) => {
  try {
    const yourFormData = await YourFormModel.find();
    const emergencyData = await Emergency.find();

    res.json({ yourFormData, emergencyData });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const accountSid = 'AC34f2f7e929c5b7fe701a8d850bb84d75';
const authToken = '682bab04e7c23853da1c0fe469c24d0b';
const twilioPhoneNumber = '+12029329455';

const twilioClient = twilio(accountSid, authToken);

app.post('/send-messages', async (req, res) => {
  try {
    const { numbers, message } = req.body;

    if (!numbers || !message) {
      return res.status(400).json({ error: 'Numbers and message are required' });
    }

    const promises = numbers.map((number) => {
      return twilioClient.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: number,
      });
    });

    await Promise.all(promises);

    res.status(200).json({ message: 'Messages sent successfully' });
  } catch (error) {
    console.error('Error sending messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});