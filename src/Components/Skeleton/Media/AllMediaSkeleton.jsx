import { Grid, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import useWindowDimensions from "../../../Hooks/Theme/useWindowDimensions";

function AllMediaSkeleton({ length }) {
  const [numberOfSkeleton, setNumberOfSkeleton] = useState(length);

  //Context
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (width >= 600 && width <= 1199) {
      setNumberOfSkeleton(12);
    } else if (width <= 599) {
      setNumberOfSkeleton(6);
    }
  }, [width]);

  return (
    <Grid container spacing={2}>
      {Array.from({ length: numberOfSkeleton })?.map((item, index) => {
        return (
          <Grid
            item
            lg={2}
            sm={3}
            xs={6}
            key={index}
            sx={{ position: "relative" }}
          >
            <Skeleton
              variant="rounded"
              width={"100%"}
              height={100}
              key={index}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}

AllMediaSkeleton.defaultProps = {
  length: 18,
};

export default AllMediaSkeleton;
