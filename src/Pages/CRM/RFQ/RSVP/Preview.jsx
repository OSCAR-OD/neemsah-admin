import React from 'react';
import { Box, Typography } from '@mui/material';
import ShortAnswer from './ShortAnswer';
import Paragraph from './Paragraph';
import RadioButton from './RadioButton';
import Checkbox from './Checkbox';
import Dropdown from './Dropdown';
import DateField from './DateField';
const Preview = ({
  sectionIndex,
  questionIndex,
  question,
  handleQuestionValueChange,
  handleAddOption,
  handleRemoveOption,
  handleOptionChange
}) => {
  const { title, type, value, options = [] } = question;

  return (
    <Box sx={{ backgroundColor: '#fff', paddingLeft: 2, paddingRight: 2, borderRadius: 1 }}>
      <Typography variant="subtitle1">{title}</Typography>
      {type === "Short Answer" && (
        <ShortAnswer
          value={value}
          onChange={(e) => handleQuestionValueChange(e, sectionIndex, questionIndex)}
        />
      )}
      {type === "Paragraph" && (
        <Paragraph
          value={value}
          onChange={(e) => handleQuestionValueChange(e, sectionIndex, questionIndex)}
        />
      )}
      {type === "Radio Button" && (
        <RadioButton
          options={options}
          onChange={(e, index) => handleOptionChange(e, sectionIndex, questionIndex, index)}
          onAddOption={() => handleAddOption(sectionIndex, questionIndex)}
          onRemoveOption={(index) => handleRemoveOption(sectionIndex, questionIndex, index)}
        />
      )}
      {type === "Checkbox" && (
        <Checkbox
          options={options}
          onChange={(e, index) => handleOptionChange(e, sectionIndex, questionIndex, index)}
          onAddOption={() => handleAddOption(sectionIndex, questionIndex)}
          onRemoveOption={(index) => handleRemoveOption(sectionIndex, questionIndex, index)}
        />
      )}
      {type === "Dropdown" && (
        <Dropdown
          options={options}
          onChange={(e, index) => handleOptionChange(e, sectionIndex, questionIndex, index)}
          onAddOption={() => handleAddOption(sectionIndex, questionIndex)}
          onRemoveOption={(index) => handleRemoveOption(sectionIndex, questionIndex, index)}
        />
      )}
       {type === "Date" && (
        <DateField
          value={value}
          onChange={(e) => handleQuestionValueChange(e, sectionIndex, questionIndex)}
        />
      )}
    </Box>
  );
};

export default Preview;
