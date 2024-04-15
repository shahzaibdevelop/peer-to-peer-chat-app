const peerId = Math.random().toString(36).substr(2, 9);
let recipientId = "";
$("#recipentidspan").on("click", function () {
  $("#peeridPrompt").modal("show");
});
document
  .getElementById("message")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      enterRecieverID();
    }
  });

const peer = new Peer(peerId);
peer.on("open", () => {
  const peerIdSpan = document.getElementById("peeridspan");
  peerIdSpan.innerHTML = peer.id.toString();
});
peer.on("connection", handleConnection);

function handleConnection(conn) {
  // console.log("Incoming connection from " + conn.peer);
  conn.on("data", (data) => handleMessage(data, conn));
}

function handleMessage(data, conn) {
  const messages = document.getElementById("messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add(
    "recieved",
    "px-3",
    "py-1",
    "mx-2",
    "rounded-3"
  );
  messageElement.innerText = conn.peer + " : " + data;
  messages.appendChild(messageElement);
  recipientId = conn.peer.toString();
  $("#recipentidspan").html(recipientId);
}
function enterRecieverID() {
  if (document.getElementById("message").value != "") {
    if (recipientId == "") {
      $("#peeridPrompt").modal("show");
    } else {
      sendMessage();
    }
  } else {
    $("#errorAlert").removeClass("d-none");
    $("#errorAlert").html("Please enter a message");
    setTimeout(() => {
      $("#errorAlert").addClass("d-none");
    }, 3000);
  }
}

function sendMessage() {
  $("#peeridPrompt").modal("hide");
  const messageInput = document.getElementById("message");
  const message = messageInput.value;
  const messages = document.getElementById("messages");
  const messageElement = document.createElement("div");
  if (recipientId == "") {
    recipientId = $("#recieverIDInput").val();
    $("#recipentidspan").html(
      recipientId == "" ? "No Recipent" : recipientId
    );
  }
  messageElement.innerText = message;
  messageElement.classList.add(
    "sender",
    "px-3",
    "py-1",
    "mx-2",
    "rounded-3"
  );
  messages.appendChild(messageElement);
  const conn = peer.connect(recipientId);
  conn.on("open", () => {
    conn.send(message);
  });
  messageInput.value = "";
  $("#messages").scrollTop($("#messages")[0].scrollHeight);
}
$(document).ready(function () {
  $("#recipentidspan").html(
    recipientId == "" ? "No Recipent" : recipientId
  );
});