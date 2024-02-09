import React, { useState, useEffect } from 'react';
import { IoLocationSharp } from "react-icons/io5";
import axios from 'axios'

const Activity = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/home'); 
      const postsWithComments = await Promise.all(
        response.data.posts.reverse().map(async (user) => {
          const postsWithComments = await Promise.all(
            user.posts.map(async (post) => {
              const commentsResponse = await axios.get(`/get-comments/${post._id}`); 
              post.comments = commentsResponse.data.comments;
              return post;
            })
          );
          user.posts = postsWithComments;
          return user;
        })
      );
      setPosts(postsWithComments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  const handleCommentSubmit = async (postId, commentContent) => {
    try {
      await otherRoutes.createComment(postId, { content: commentContent });
      fetchData();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        posts.map((user) => (
          <div key={user.username}>
            {user.posts.map((post) => (
              <div key={post._id} className="post">
                <h5>{post.title}</h5>
                <p>{post.content}</p>
                <p><IoLocationSharp  style={{width:"15px", height:"15px"}}/> {post.location}</p>
                <div>
                  {post.images.map((image) => (
                    <img key={image._id} src={`http://localhost:3000/images/${image.url}`} alt="Post" />
                  ))}
                </div>
                <h6>Posted by: {user.username}</h6>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const commentContent = e.target.comment.value;
                    handleCommentSubmit(post._id, commentContent);
                    e.target.comment.value = '';
                  }}
                >
                </form>
                {post.comments && post.comments.length > 0 ? (
                  <div className='comments'>
                    <h6>Comments:</h6>
                    <ul>
                      {post.comments.map((comment) => (
                        <li key={comment._id}>{comment.content}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No comments</p>
                )}
              </div>
            ))}
          </div>
        ))
      )}
      <div className="buffer"></div>
    </div>
  );
};

export default Activity;