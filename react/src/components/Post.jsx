import React, { useState } from 'react';
import { otherRoutes } from '../api/api'; 

const Post = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImage] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const hardcodedLocations = [
    'Jaipur',
    'Udaipur',
    'Jodhpur',
    'Jaisalmer',
    'Ajmer',
    'Mount Abu',
    'Bikaner',
    'Pushkar',
    'Alwar',
    'Kota',
    'Chittorgarh',
    'Bharatpur',
    'Sikar',
    'Ranthambore',
    'Shekhawati',
    'Dausa',
    'Bundi',
    'Sawai Madhopur',
    'Barmer',
    'Nagaur',
  ];

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleSubmit = async (formData) => {
    try {
      console.log(formData);
      const response = await otherRoutes.createPost(formData);
      console.log('Create Post Response:', response.data);
    } catch (error) {
      console.error('Create Post Error:', error.response ? error.response.data : error.message);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (title.trim() === '' && content.trim() === '' && !images) {
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('images', images);

    formData.append('location', selectedLocation);

    handleSubmit(formData);

    setTitle('');
    setContent('');
    setImage(null);
    setSelectedLocation('');
  };

  return (
    <div className='postcomponent'>
      <h4>Create a Post</h4>
      <form onSubmit={handleFormSubmit} className='formcss'>
        <label>
          Title:
          <input type="text" value={title} onChange={handleTitleChange} className='textinputarea'/>
        </label>
        <br />
        <label>
          Content:
          <textarea rows="4" value={content} onChange={handleContentChange} className='textinputarea'></textarea>
        </label>
        <br />
        <div className='fileandbutton'>
          <label>
            Image:
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
          <br />
          <div className="location">
          <label >
            Tag a location:
            <select value={selectedLocation} onChange={handleLocationChange}>
              <option value="">Select a location</option>
              {hardcodedLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </label>
          </div>
          <br />
          <button type="submit">Post</button>
        </div>
      </form>
    </div>
  );
};

export default Post;
