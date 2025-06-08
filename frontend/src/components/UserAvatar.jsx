import React from 'react';

const UserAvatar = ({ user, size = 'md' }) => {
  // Determine sizes based on the size prop
  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-10 h-10",
    xl: "w-12 h-12"
  };

  // Get profile image URL
  const getProfileImageUrl = () => {
    if (user) {
      if (user.profileImage) return user.profileImage;
      if (user.avatar) return user.avatar;
      if (user.photoURL) return user.photoURL;
      if (user.picture) return user.picture;
    }
    return null;
  };

  // Get display name for fallback text
  const getName = () => {
    if (user) {
      if (user.displayName) return user.displayName;
      if (user.username) return user.username;
      if (user.name) return user.name;
      if (user.email) return user.email.split('@')[0];
    }
    return 'User';
  };

  const getUserInitial = () => {
    const name = getName();
    return name !== 'User' ? name.charAt(0).toUpperCase() : 'U';
  };

  const profileImageUrl = getProfileImageUrl();

  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary-400 to-secondary-500`}>
      {profileImageUrl ? (
        <img 
          src={profileImageUrl} 
          alt="Profile" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.style.display = 'none';
            e.target.parentNode.classList.add('flex', 'items-center', 'justify-center', 'text-white');
            e.target.parentNode.innerHTML = getUserInitial();
          }}
        />
      ) : (
        <span className="text-white font-bold">
          {getUserInitial()}
        </span>
      )}
    </div>
  );
};

export default UserAvatar;
