import React from 'react';
import { TextField, Select, MenuItem, Box, IconButton } from '@mui/material';
import { MdKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import ShortAnswer from './ShortAnswer';
import Paragraph from './Paragraph';
import RadioButton from './RadioButton';
import Checkbox from './Checkbox';
import Dropdown from './Dropdown';
import DateField from './DateField';
import Edit from './Edit';

const Question = ({
  sectionIndex,
  questionIndex,
  question,
  handleQuestionTitleChange,
  handleQuestionTypeChange,
  handleQuestionValueChange,
  handleDeleteQuestion,
  handleMoveQuestionUp,
  handleMoveQuestionDown,
  handleAddQuestionBelow,
  handleAddOption,
  handleRemoveOption,
  handleOptionChange
}) => {
  const { title, type, value, options = [] } = question; 
  
  return (
    <Box sx={{ mt: 2, backgroundColor: '#fff', padding: 2, borderRadius: 1}}>
      <Box sx={{ display: 'flex', alignItems: "center", gap: 2 }}>
        <TextField
          sx={{ width: 800  }}
          label="Question"
          value={title}
          onChange={(e) => handleQuestionTitleChange(e, sectionIndex, questionIndex)}
          required
          variant="outlined"
          margin="dense"
        />
        <Select
          sx={{ flexGrow: 1, width: 100 }}
          value={type}
          variant="outlined"
          margin="dense"
          onChange={(e) => handleQuestionTypeChange(e, sectionIndex, questionIndex)}
        >
          <MenuItem value="Radio Button">Radio Button</MenuItem>
          <MenuItem value="Short Answer">Short Answer</MenuItem>
          <MenuItem value="Checkbox">Checkbox</MenuItem>
          <MenuItem value="Paragraph">Paragraph</MenuItem>
          <MenuItem value="Dropdown">Dropdown</MenuItem>
          <MenuItem value="Date">Date</MenuItem>
        </Select>
      </Box>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Box>
          <IconButton onClick={() => handleMoveQuestionUp(sectionIndex, questionIndex)}>
            <MdKeyboardArrowUp />
          </IconButton>
          <IconButton onClick={() => handleMoveQuestionDown(sectionIndex, questionIndex)}>
            <MdOutlineKeyboardArrowDown />
          </IconButton>
        </Box>
        <Edit
          handleAdd={() => handleAddQuestionBelow(sectionIndex, questionIndex)}
          handleDelete={() => handleDeleteQuestion(sectionIndex, questionIndex)}
        />
      </Box>
    </Box>
  );
};

export default Question;
