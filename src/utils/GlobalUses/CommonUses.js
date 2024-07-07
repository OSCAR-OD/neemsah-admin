//Image type
export const isVideoType = "video";

//Format tags
export const formatTags = (data) => {
  //console.log("formatTags - data:", data);
  return data?.map((item) => {
    if (typeof item === "string") {
      return item;
    } else {
      return item?.inputValue;
    }
  });
};
