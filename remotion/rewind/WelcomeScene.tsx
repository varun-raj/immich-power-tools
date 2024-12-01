import React from 'react'

interface WelcomeSceneProps {
  message: string;
  emoji: string;
}
export default function WelcomeScene({ message, emoji }: WelcomeSceneProps) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      animation: "zoomIn 1s ease forwards",
    }}>
      <p style={{  
        fontSize: 100, 
        color: "lightblue",
        marginTop: 40,
        marginBottom: 0,
        textAlign: "center",
        transition: "opacity 1s ease",
      }}>
        {emoji}
      </p>
      <p style={{
        fontSize: 70,
        padding: "0 70px",
        color: "lightblue",
        marginTop: 0,
        textAlign: "center",
        transition: "opacity 1s ease",
      }}>
        {message}
      </p>
    </div>
  )
}

// Add this CSS to your global styles or a CSS-in-JS solution
const styles = `
@keyframes zoomIn {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
