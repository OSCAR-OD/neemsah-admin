import { Skeleton, Stack, TableCell, TableRow } from "@mui/material";
import React, { Fragment } from "react";

function TableSkeleton({
  numberOfSkeleton,
  isShowIndex,
  isShowTitle,
  numberOfTitle,
  isShowDescription,
  isShowImage,
  numberOfImage,
  isShowAction,
  numberOfAction,
  isShowLink,
}) {
 
  return (
    <Fragment>
      {Array.from({ length: numberOfSkeleton })?.map((item, index) => {
        return (
          <TableRow key={index} sx={{ borderBottom: "1px solid #d7d7d7" }}>
            {isShowIndex && (
              <TableCell component={"td"}>
                <Skeleton
                  variant="rounded"
                  width={45}
                  height={20}
                  sx={{ mt: 0.8, ml: -1 }}
                />
              </TableCell>
            )}
            {isShowTitle &&
              Array.from({ length: numberOfTitle })?.map((item, titleIndex) => {
                return (
                  <Fragment key={titleIndex}>
                    <TableCell component={"td"}>
                      <Skeleton
                        variant="rounded"
                        width={"100%"}
                        height={20}
                        sx={{ mt: 0.8 }}
                      />
                    </TableCell>
                  </Fragment>
                );
              })}
            {isShowDescription && (
              <TableCell component={"td"}>
                <Skeleton
                  variant="rounded"
                  width={"100%"}
                  height={14}
                  sx={{ mt: 0.8 }}
                />
                <Skeleton
                  variant="rounded"
                  width={"60%"}
                  height={10}
                  sx={{ mt: 0.8 }}
                />
              </TableCell>
            )}
            {isShowLink && (
              <TableCell component={"td"}>
                <Skeleton
                  variant="rounded"
                  width={"100%"}
                  height={20}
                  sx={{ mt: 0.8 }}
                />
              </TableCell>
            )}
            {isShowImage && (
              <TableCell component={"td"}>
                <Stack direction={"row"} gap={0.8}>
                  {Array.from({ length: numberOfImage })?.map(
                    (item, imageIndex) => {
                      return (
                        <Skeleton
                          variant="rounded"
                          width={60}
                          height={50}
                          sx={{ mt: 0.8 }}
                          key={imageIndex}
                        />
                      );
                    }
                  )}
                </Stack>
              </TableCell>
            )}
            {isShowAction && (
              <TableCell component={"td"}>
                <Stack direction={"row"} justifyContent={"end"} gap={0.8}>
                  {Array.from({ length: numberOfAction })?.map(
                    (item, actionIndex) => {
                      return (
                        <Skeleton
                          variant="circular"
                          width={35}
                          height={35}
                          sx={{ mt: 0.8 }}
                          key={actionIndex}
                        />
                      );
                    }
                  )}
                </Stack>
              </TableCell>
            )}
          </TableRow>
        );
      })}
    </Fragment>
  );
}

TableSkeleton.defaultProps = {
  numberOfSkeleton: 5,
  isShowIndex: true,
  numberOfTitle: 2,
  isShowTitle: true,
  isShowDescription: true,
  isShowImage: true,
  numberOfImage: 1,
  isShowAction: true,
  numberOfAction: 2,
  isShowLink: false,
};

export default TableSkeleton;
