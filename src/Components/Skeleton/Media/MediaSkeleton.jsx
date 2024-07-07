import { Grid, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import useWindowDimensions from "../../../Hooks/Theme/useWindowDimensions";

function MediaSkeleton({ length }) {
  const [numberOfSkeleton, setNumberOfSkeleton] = useState(length);

  //Context
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (width >= 1500) {
      setNumberOfSkeleton(30);
    } else if (width >= 1200 && width <= 1499) {
      setNumberOfSkeleton(24);
    } else if (width >= 900 && width <= 1199) {
      setNumberOfSkeleton(15);
    } else if (width >= 600 && width <= 899) {
      setNumberOfSkeleton(12);
    } else if (width <= 599) {
      setNumberOfSkeleton(9);
    }
  }, [width]);

  return (
    <Grid
      container
      columns={{ xl: 20, lg: 16, md: 15, sm: 12, xs: 12 }}
      spacing={2}
    >
      {Array.from({ length: numberOfSkeleton })?.map((item, index) => {
        return (
          <Grid
            item
            lg={2}
            sm={3}
            xs={4}
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

MediaSkeleton.defaultProps = {
  length: 20,
};

export default MediaSkeleton;
