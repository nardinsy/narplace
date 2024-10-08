const contentTypeBufferSplit = (data: string) => {
  const contentType: string = data.substring(
    data.indexOf(":") + 1,
    data.indexOf(";")
  );

  const split = data.split(",");
  const base64string = split[1];
  const buffer = Buffer.from(base64string, "base64");

  return { contentType, buffer };
};

export default contentTypeBufferSplit;
