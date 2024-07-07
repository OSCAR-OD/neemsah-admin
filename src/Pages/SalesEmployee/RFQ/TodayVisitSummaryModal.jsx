import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Modal } from "@mui/material";
import { getApiHandler } from "../../../lib/axios/ApiHelper";
import { useParams } from 'react-router-dom';

const TodayVisitSummaryModal = ({ open, handleClose }) => {
  const { pid } = useParams();
  const [visitSummary, setVisitSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchVisitSummary = async () => {
      setIsLoading(true);
      setIsError(false);

      const res = await getApiHandler(`/admin/sales/todayVisitSummary/${pid}`);

      if (res?.success) {
        setVisitSummary(res.data);
      } else {
        setIsError(true);
      }

      setIsLoading(false);
    };

    if (open) {
      fetchVisitSummary();
    }
  }, [pid, open]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : isError ? (
          <Typography>Error fetching data</Typography>
        ) : (
          visitSummary && (
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Today’s Visit Summary
                </Typography>
                <Typography>
                  {visitSummary.details}
                </Typography>
              </CardContent>
            </Card>
          )
        )}
      </Box>
    </Modal>
  );
};

export default TodayVisitSummaryModal;
