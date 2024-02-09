import React, { useState, useEffect } from 'react';
import { otherRoutes } from '../api/api';

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfilePosts = async () => {
      try {
        const response = await otherRoutes.profile();
        setPosts(response.data.posts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile posts:', error);
        setLoading(false);
      }
    };

    fetchProfilePosts();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {posts.length === 0 ? (
            <p className='nopost'>You have not created any posts. Create a post to display here.</p>
          ) : (
            posts.map(post => (
              <div key={post._id} className="post">
                <h5>{post.title}</h5>
                <p>{post.content}</p>
                <div>
                  {post.images.map(image => (
                    <img key={image._id} src={`http://localhost:3000/images/${image.url}`} alt="Post" />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <div className="buffer"></div>
    </div>
  );
}

export default Profile;
