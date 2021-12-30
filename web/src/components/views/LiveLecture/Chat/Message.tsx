const Message = ({
  username,
  message,
  name,
}: {
  username: string;
  message: string;
  name?: string;
}) => {
  const sender = username === name ? "Me" : username;

  return (
    <div style={{ marginLeft: -50, marginTop: 10 }}>
      <div className="sender" style={{ fontWeight: "bold" }}>
        {sender}
      </div>
      <div
        style={{
          marginTop: 5,
          border: "solid",
          width: "50%",
          backgroundColor: "#c4c4c4",
          borderRadius: 10,
        }}
      >
        <span style={{ fontWeight: "bold", paddingLeft: 20 }}>{message}</span>
      </div>
    </div>
  );
};

export default Message;
