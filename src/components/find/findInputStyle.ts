const findInputStyle = {
  control: {
    backgroundColor: 'hsl(var(--input))',
    fontSize: 20,
    fontWeight: 'normal',
    outline: 'none',
    borderRadius: '15px',
    
  },

  '&singleLine': {
    // display: 'inline-block',
    width: '100%',
    
    highlighter: {
      padding: '10px 15px',
      border: 'none',
      outline: 'none',
    },
    input: {
      padding: '10px 15px',
      border: 'none',
      outline: 'none',
    },
  },

  suggestions: {

    list: {
      backgroundColor: 'hsl(var(--background))',
      fontSize: 14,
      border: '1px solid hsl(var(--border))',
      overflow: 'hidden',
    },
    item: {
      padding: '5px 15px',
      border: 'none',
      '&focused': {
        backgroundColor: 'hsl(var(--chart-2))',
      },
    },
  },
}

export default findInputStyle;