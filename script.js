// Init Lucide Icons
lucide.createIcons();

// GSAP Intro Animation
window.addEventListener("load", () => {
  const tl = gsap.timeline({
    defaults: { ease: "expo.out", duration: 1.5 },
  });
  tl.to(".nav-el", { opacity: 1, y: 0 })
    .to(".title-el", { opacity: 1, y: -10 }, "-=1.2")
    .to(".cta-el", { opacity: 1, y: -10 }, "-=1.3")
    .to(".video-el", { opacity: 1, scale: 1, y: 0 }, "-=1.3");
});


const el = {
  loading: document.getElementById("loading"),
  loadingText: document.getElementById("loading-text"),
  video: document.getElementById("video"),
  error: document.getElementById("error"),
  errorMessage: document.getElementById("error-message"),
  placeholder: document.getElementById("placeholder"),
  apiKey: document.getElementById("api-key"),
  uploadButton: document.getElementById("upload-widget"),
};

// app state and actions
const app = {
  cloudName: "dhgdmbhtj",
  uploadPreset: "upload_video",
  transcriptionURL: "",
  public_id: "",
  waitForTranscription: async () => {
    const maxAttempts = 30;
    for (let i = 0; i < maxAttempts; i++) {
      const currentUrl = `https://res.cloudinary.com/${app.cloudName}/raw/upload/v${Date.now()}/${app.public_id}.transcript`;
      try {
        const response = await fetch(currentUrl);
        if (response.ok) {
          app.transcriptionURL = currentUrl;
          return true;
        }
      } catch (e) {
        console.log("Fetch check error", e);
      }
      await new Promise((r) => setTimeout(r, 2000));
    }
    return false;
  },
  getTranscription: async () => {
    const response = await fetch(app.transcriptionURL);
    return response.text();
  },
  getViralMoment: async () => {
    const transcription = await app.getTranscription();
    const model = "gemini-2.5-flash";
    const apiKey = el.apiKey.value;
    if (!apiKey) throw new Error("API Key é obrigatória");

    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const prompt = `
Role: You are a professional video editor specializing in viral content.
Task: Analyze the transcription below and identify the most engaging, funny, or surprising segment.
Constraints:
1. Duration: Minimum 30 seconds, Maximum 60 seconds.
2. Format: Return ONLY the start and end string for Cloudinary. Format: so_<start_seconds>,eo_<end_seconds>
3. Examples: "so_10,eo_20" or "so_12.5,eo_45.2"
4. CRITICAL: Do not use markdown, do not use quotes, do not explain. Return ONLY the raw string.

Transcription:
${transcription}
`;

    const header = {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json",
    };

    const contents = [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];

    const response = await fetch(geminiEndpoint, {
      method: "POST",
      headers: header,
      body: JSON.stringify({ contents }),
    });

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;

    return rawText.replace(/```/g, "").replace(/json/g, "").trim();
  },
};

const myWidget = cloudinary.createUploadWidget(
  {
    cloudName: app.cloudName,
    uploadPreset: app.uploadPreset,
    theme: "minimal",
    styles: {
      palette: {
        window: "#0F172A",
        sourceList: "#0F172A",
        activeTab: "#2563EB",
        action: "#2563EB",
        inactiveTabIcon: "#64748B",
        menuIcons: "#64748B",
        link: "#3B82F6",
        textDark: "#000000",
        textLight: "#FFFFFF",
        mainShadow: "#000000",
        background: "#020617",
      },
    },
  },
  async (error, result) => {
    if (!error && result && result.event === "success") {
      const { public_id } = result.info;
      app.public_id = public_id;

      try {
        el.loading.classList.remove("hidden");
        el.loadingText.innerText = "Aguardando transcrição...";
        el.error.classList.add("hidden");

        const isReady = await app.waitForTranscription();
        if (!isReady) throw new Error("A transcrição demorou demais.");

        el.loadingText.innerText = "Gerando momento viral com IA...";

        const viralMoment = await app.getViralMoment();
        const viralMomentURL = `https://res.cloudinary.com/${app.cloudName}/video/upload/${viralMoment}/${app.public_id}.mp4`;

        // Display Video with Animation
        el.video.setAttribute("src", viralMomentURL);
        el.video.classList.remove("hidden");
        el.placeholder.classList.add("opacity-0");

        gsap.from(el.video, {
          opacity: 0,
          scale: 0.98,
          filter: "blur(10px)",
          duration: 1,
        });
      } catch (e) {
        el.errorMessage.innerText = e.message || "Erro inesperado";
        el.error.classList.remove("hidden");
      } finally {
        el.loading.classList.add("hidden");
      }
    }
  },
);

el.uploadButton.addEventListener(
  "click",
  () => {
    if (!el.apiKey.value) {
      alert("Por favor, insira sua chave de API do Gemini primeiro.");
      el.apiKey.focus();
      return;
    }
    myWidget.open();
  },
  false,
);
