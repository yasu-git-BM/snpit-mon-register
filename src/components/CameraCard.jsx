import React from 'react';

export default function CameraCard({ name, image, remainingShots }) {
  return (
    <div className="camera-card">
      {image && (
        <img
          src={image}
          alt={name}
          className="camera-image"
          style={{ width: '100%', objectFit: 'cover' }}
        />
      )}
      <div className="camera-info" style={{ padding: '8px' }}>
        <h3 style={{ margin: 0 }}>{name}</h3>
        <p style={{ margin: '4px 0', color: '#666' }}>
          残枚数: {remainingShots}
        </p>
      </div>
    </div>
  );
}
