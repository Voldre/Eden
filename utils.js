export async function callPHP(data) {
  $.ajax({
    url: "jdr_backend.php",
    type: "post",
    data: data,
    async: true,
  });
  console.log("jdr_backend.php executed, data : ", data);
}
