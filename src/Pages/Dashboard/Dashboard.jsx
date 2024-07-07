import { Button, Paper, Typography, Box, Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/Auth/UseAuth";
import { useNavigate } from 'react-router-dom';
import dailyVst from "/assets/icons/sales/dailyVst.svg";
import fin from "/assets/icons/sales/fin.svg";
import tsk from "/assets/icons/sales/tsk.svg";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = (page) => {
    navigate(page);
  };

  return (
    <>
      {user.role === "User" && (
        <Paper
          sx={{
            p: { sm: 3, xs: 2 },
            maxWidth: 600,
            width: 1,
            mx: "auto",
            mt: 5,
            textAlign: "center",
          }}
        >
          <Typography variant="welcomeTitle">
            Welcome to neemsah dashboard
          </Typography>
          <Typography variant="formLabelSmall">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas
            reprehenderit rerum consequuntur numquam. Sapiente a itaque explicabo
            nobis aut error. Ipsam amet officiis ratione optio earum quod nam
            recusandae natus.
          </Typography>
          <Button
            LinkComponent={Link}
            variant="contained"
            sx={{ mt: 5 }}
            to="/media"
            state={"Media"}
          >
            Get Started
          </Button>
        </Paper>
      )}
      {user.role === "Sales Employee" && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
            '@media (min-width: 376px)': {
              display: 'flex',
              margin: '10px 0',
              justifyContent: 'flex-start',
              flexDirection: 'row',
              flexWrap: 'nowrap',
            }
          }}
        >
          <Card
            sx={{
              flexGrow: 1,
              cursor: 'pointer',
              minWidth: { xs: 80, sm: 120 },
              maxWidth: { xs: 100, sm: 160 },
              margin: { xs: '0 auto', sm: '10px 0' },
            }}
            onClick={() => handleCardClick('/salesDashboard/daily-visit')}
          >
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                padding: { xs: '12px !important', sm: '24px !important' },
              }}
            >
              <Box
                component={"img"}
                src={dailyVst}
                alt="Daily Visit"
                sx={{ width: { xs: 30, sm: 40 } }}
              />
              <Typography variant="h6" component="div" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Daily Visit
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                40
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              flexGrow: 1,
              cursor: 'pointer',
              minWidth: { xs: 80, sm: 120 },
              maxWidth: { xs: 100, sm: 160 },
              margin: { xs: '0 auto', sm: '10px 0' },
            }}
            onClick={() => handleCardClick('/salesDashboard/finance')}
          >
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                padding: { xs: '12px !important', sm: '24px !important' },
              }}
            >
              <Box
                component={"img"}
                src={fin}
                alt="Finance"
                sx={{ width: { xs: 30, sm: 40 } }}
              />
              <Typography variant="h6" component="div" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Finance
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                30
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              flexGrow: 1,
              cursor: 'pointer',
              minWidth: { xs: 80, sm: 120 },
              maxWidth: { xs: 100, sm: 160 },
              margin: { xs: '0 auto', sm: '10px 0' },
            }}
            onClick={() => handleCardClick('/salesDashboard/tasks')}
          >
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                padding: { xs: '12px !important', sm: '24px !important' },
              }}
            >
              <Box
                component={"img"}
                src={tsk}
                alt="Tasks"
                sx={{ width: { xs: 30, sm: 40 } }}
              />
              <Typography variant="h6" component="div" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Tasks
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                30
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  );
}

export default Dashboard;
