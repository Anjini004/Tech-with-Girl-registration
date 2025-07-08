let shareCount = 0;
const maxShareCount = 5;

const whatsappBtn = document.getElementById("whatsappBtn");
const shareCountText = document.getElementById("shareCountText");
const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");
const messageEl = document.getElementById("message");

// Reset everything at start (in case of refresh)
form.reset();
shareCountText.textContent = "Click count: 0/5";
messageEl.textContent = "";

whatsappBtn.addEventListener("click", () => {
  if (shareCount >= maxShareCount) return;

  const message = encodeURIComponent("Hey Buddy, Join Tech For Girls Community! 🌸💻");
  const whatsappURL = `https://wa.me/?text=${message}`;
  window.open(whatsappURL, "_blank");

  shareCount++;
  shareCountText.textContent = `Click count: ${shareCount}/${maxShareCount}`;

  if (shareCount === maxShareCount) {
    shareCountText.textContent += " ✅ Sharing complete. Please continue.";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (shareCount < maxShareCount) {
    alert("Please complete sharing (5/5) before submitting.");
    return;
  }

  submitBtn.disabled = true;

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const college = document.getElementById("college").value.trim();
  const screenshotFile = document.getElementById("screenshot").files[0];

  if (!screenshotFile) {
    alert("Please upload your screenshot file.");
    submitBtn.disabled = false;
    return;
  }

  const reader = new FileReader();

  reader.onloadend = async function () {
    const base64Data = reader.result.split(",")[1];

    const formData = new URLSearchParams();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("college", college);
    formData.append("screenshotData", base64Data);
    formData.append("fileName", screenshotFile.name);
    formData.append("mimeType", screenshotFile.type);

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbyqbe6uQvB8oGq1ZZH8oAtC47jBN1a8JHUYiI_wGUhBFmmxSja9AQ8bIu0jBRWW5Jhs/exec", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // ✅ Show success message
        messageEl.textContent = "🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!";
        messageEl.style.color = "green";

        // ✅ Wait 3 seconds then reset everything
        setTimeout(() => {
          form.reset();
          shareCount = 0;
          shareCountText.textContent = "Click count: 0/5";
          messageEl.textContent = "";
          submitBtn.disabled = false;
        }, 3000);
      } else {
        throw new Error("❌ Submission failed. Please try again.");
      }
    } catch (error) {
      alert(error.message);
      submitBtn.disabled = false;
    }
  };

  reader.readAsDataURL(screenshotFile);
});
