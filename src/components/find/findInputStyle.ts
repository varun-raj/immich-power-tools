const findInputStyle = {
  control: {
    backgroundColor: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
  },


  '&singleLine': {
    display: 'inline-block',
    
    highlighter: {
      padding: '10px',
      border: '2px inset transparent',
    },
    input: {
      width: "100%",
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #e0e0e0',
    },
  },

  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '1px solid rgba(0,0,0,0.15)',
      fontSize: 14,
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
      '&focused': {
        backgroundColor: '#cee4e5',
      },
    },
  },
}

export default findInputStyle;