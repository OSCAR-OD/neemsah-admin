import React, { useState, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { Button, TextField, Container, Box, IconButton } from '@mui/material';
import { MdDelete } from "react-icons/md";
import Question from './RSVP/Question';
import {
  fetchReducer,
  getApiHandler,
  postApiHandler,
  initialFetchData,
} from "../../../lib/axios/ApiHelper";
import { toast } from "react-toastify";
const RSVPPage = () => {
  const [{ isLoading, isError, errorMessage, fetchData }, dispatch] = useReducer(fetchReducer, initialFetchData);
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rfqTypeTitle, setRfqTypeTitle] = useState('');
  const [rfqTypeID, setRfqTypeID] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const initialResponse = await getApiHandler(`/admin/crm/singleRfqType/${id}`);
        //console.log("initialResponse", initialResponse);
        const fetchedRfqType = initialResponse?.data?.rfqType;
        const rfqTypeID = initialResponse?.data?.customID;

        if (fetchedRfqType && rfqTypeID ) {
          setRfqTypeTitle(fetchedRfqType);
          setRfqTypeID(rfqTypeID);
          const formResponse = await getApiHandler(`/admin/crm/singleRSVP/${rfqTypeID}`);
          const { title, description, sections } = formResponse.data;
          setTitle(title || '');
          setDescription(description || '');
          setSections(sections || []);
        } else {
          console.error('rfqType is not found in the response');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescChange = (e) => {
    setDescription(e.target.value);
  };

  const handleAddSection = () => {
    setSections([...sections, { title: '', questions: [] }]);
  };

  const handleDeleteSection = (sectionIndex) => {
    setSections(sections.filter((_, index) => index !== sectionIndex));
  };

  const handleSectionTitleChange = (e, sectionIndex) => {
    const updatedSections = sections.map((section, index) =>
      index === sectionIndex ? { ...section, title: e.target.value } : section
    );
    setSections(updatedSections);
  };

  const handleAddQuestionBelow = (sectionIndex, questionIndex) => {
    const updatedSections = sections.map((section, index) => {
      if (index === sectionIndex) {
        const newQuestions = [...section.questions];
        newQuestions.splice(questionIndex + 1, 0, { title: '', type: 'Short Answer', value: '', options: [] });
        return { ...section, questions: newQuestions };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const handleAddQuestion = (sectionIndex) => {
    const updatedSections = sections.map((section, index) =>
      index === sectionIndex
        ? { ...section, questions: [...section.questions, { title: '', type: 'Short Answer', value: '', options: [] }] }
        : section
    );
    setSections(updatedSections);
  };

  const handleDeleteQuestion = (sectionIndex, questionIndex) => {
    const updatedSections = sections.map((section, index) =>
      index === sectionIndex
        ? { ...section, questions: section.questions.filter((_, qIndex) => qIndex !== questionIndex) }
        : section
    );
    setSections(updatedSections);
  };

  const handleQuestionTitleChange = (e, sectionIndex, questionIndex) => {
    const updatedSections = sections.map((section, index) =>
      index === sectionIndex
        ? {
          ...section,
          questions: section.questions.map((question, qIndex) =>
            qIndex === questionIndex ? { ...question, title: e.target.value } : question
          )
        }
        : section
    );
    setSections(updatedSections);
  };

  const handleQuestionTypeChange = (e, sectionIndex, questionIndex) => {
    const updatedSections = sections.map((section, index) =>
      index === sectionIndex
        ? {
          ...section,
          questions: section.questions.map((question, qIndex) =>
            qIndex === questionIndex ? { ...question, type: e.target.value } : question
          )
        }
        : section
    );
    setSections(updatedSections);
  };

  const handleQuestionValueChange = (valueOrEvent, sectionIndex, questionIndex) => {
    const value = typeof valueOrEvent === 'string' ? valueOrEvent : valueOrEvent.target.value;
    
    const updatedSections = sections.map((section, index) =>
      index === sectionIndex
        ? {
          ...section,
          questions: section.questions.map((question, qIndex) =>
            qIndex === questionIndex ? { ...question, value } : question
          )
        }
        : section
    );
    setSections(updatedSections);
  };

  const handleMoveQuestionUp = (sectionIndex, questionIndex) => {
    if (questionIndex === 0) return;
    const updatedSections = sections.map((section, index) => {
      if (index === sectionIndex) {
        const questions = [...section.questions];
        const temp = questions[questionIndex - 1];
        questions[questionIndex - 1] = questions[questionIndex];
        questions[questionIndex] = temp;
        return { ...section, questions };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const handleMoveQuestionDown = (sectionIndex, questionIndex) => {
    const section = sections[sectionIndex];
    if (questionIndex === section.questions.length - 1) return;
    const updatedSections = sections.map((section, index) => {
      if (index === sectionIndex) {
        const questions = [...section.questions];
        const temp = questions[questionIndex + 1];
        questions[questionIndex + 1] = questions[questionIndex];
        questions[questionIndex] = temp;
        return { ...section, questions };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const handleAddOption = (sectionIndex, questionIndex) => {
    const updatedSections = sections.map((section, index) => {
      if (index === sectionIndex) {
        const newQuestions = [...section.questions];
        newQuestions[questionIndex].options.push('');
        return { ...section, questions: newQuestions };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const handleRemoveOption = (sectionIndex, questionIndex, optionIndex) => {
    const updatedSections = sections.map((section, index) => {
      if (index === sectionIndex) {
        const newQuestions = [...section.questions];
        newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter((_, idx) => idx !== optionIndex);
        return { ...section, questions: newQuestions };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const handleOptionChange = (e, sectionIndex, questionIndex, optionIndex) => {
    const updatedSections = sections.map((section, index) => {
      if (index === sectionIndex) {
        const newQuestions = [...section.questions];
        newQuestions[questionIndex].options[optionIndex] = e.target.value;
        return { ...section, questions: newQuestions };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = { title, description, sections, rfqTypeID  };
      //console.log("formData", formData);
      const res = await postApiHandler(`/admin/crm/submitRSVPForm`, formData);
      if (res?.success) {
        toast.success("RSVP Form Saved");
      } else {
        if (res?.response?.status === 404) {
          toast.warn("Something went wrong");
        } else {
          toast.warn("Something went wrong");
        }
    }
   } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, backgroundColor: '#f0f0f0', padding: 3, borderRadius: 2, position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: -31, left: 0, backgroundColor: 'blue', color: 'white', padding: '5px 10px', borderRadius: 1 }}>
          RSVP Form For {rfqTypeTitle}
        </Box>
        <TextField
          fullWidth
          label="Form Title"
          value={title}
          onChange={handleTitleChange}
          required
          variant="standard"
          margin="normal"
          placeholder="Enter form title"
          InputProps={{
            sx: {
              transition: 'border-bottom 0.3s',
              '&:hover:not(.Mui-disabled):before': {
                borderBottom: '2px solid #ccc',
              },
              '&.Mui-focused:before': {
                borderBottom: '2px solid #ccc',
              },
            },
          }}
        />
        <TextField
          fullWidth
          label="Form Description"
          value={description}
          onChange={handleDescChange}
          required
          variant="standard"
          margin="normal"
          placeholder="Enter form description"
          InputProps={{
            sx: {
              transition: 'border-bottom 0.3s',
              '&:hover:not(.Mui-disabled):before': {
                borderBottom: '2px solid #000',
              }
            },
          }}
        />
        {sections.map((section, sectionIndex) => (
          <Box key={sectionIndex} sx={{ mt: 3, backgroundColor: '#D9D9D9', borderRadius: 1 }}>
            <Box sx={{ mt: 3, display: 'flex', backgroundColor: '#fff', padding: 2, borderRadius: 1 }}>
              <TextField
                fullWidth
                label="Section Title"
                value={section.title}
                onChange={(e) => handleSectionTitleChange(e, sectionIndex)}
                variant="standard"
                sx={{ backgroundColor: '#fff', paddingRight: 3 }}
                placeholder="Enter section title"
                InputProps={{
                  sx: {
                    transition: 'border-bottom 0.3s',
                    '&:hover:not(.Mui-disabled):before': {
                      borderBottom: '2px solid #000',
                    },
                    '&.Mui-focused:before': {
                      borderBottom: '2px solid #000',
                    },
                  },
                }}
              />
              <IconButton onClick={() => handleDeleteSection(sectionIndex)}>
                <MdDelete size={20}/>
              </IconButton>
            </Box>
            {section.questions.map((question, questionIndex) => (
              <Question
                key={questionIndex}
                sectionIndex={sectionIndex}
                questionIndex={questionIndex}
                question={question}
                handleQuestionTitleChange={handleQuestionTitleChange}
                handleQuestionTypeChange={handleQuestionTypeChange}
                handleQuestionValueChange={handleQuestionValueChange}
                handleAddQuestion={handleAddQuestion}
                handleDeleteQuestion={handleDeleteQuestion}
                handleMoveQuestionUp={handleMoveQuestionUp}
                handleMoveQuestionDown={handleMoveQuestionDown}
                handleAddQuestionBelow={handleAddQuestionBelow}
                handleAddOption={handleAddOption}
                handleRemoveOption={handleRemoveOption}
                handleOptionChange={handleOptionChange}
              />
            ))}
            <Button onClick={() => handleAddQuestion(sectionIndex)} variant="contained" color="primary" sx={{ mt: 1, mb: 1 }}>
              Add Field
            </Button>
          </Box>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button onClick={handleAddSection} variant="contained" color="primary">
            Add Section
          </Button>
        </Box>
        {sections.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button type="submit" variant="contained" color="primary">
              {loading ? 'Processing' : 'Save Form'}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default RSVPPage;
