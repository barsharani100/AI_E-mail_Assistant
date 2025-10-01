console.log(" yoo dude! the code is working , you reached content.js file");

function getEmailContent() {
    const selectors = [
        ".h7",
        ".a3s.aiL",
        '[role="presentation"]',
        "gmail_quote"
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
    }
    return "";

}
function findComposeToolbar() {

    const selectors = [
        ".btC",
        ".aDh",
        '[role="toolbar"]',
        ".gU.Up"
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createAIButton() {
    const container = document.createElement("div");
    container.style.display = "inline-flex";
    container.style.alignItems = "center";
    container.style.position = "relative";
    container.className = "ai-reply-container";
    container.setAttribute("data-tone", "professional"); // default tone

    const button = document.createElement("div");
    button.className = "T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button";
    button.setAttribute("role", "button");
    button.setAttribute("data-tooltip", "Generate AI Reply");

    const label = document.createElement("span");
    label.className = "ai-reply-label";
    label.textContent = "mail-AI";
    button.appendChild(label);

    const dropdownArrow = document.createElement("div");
    dropdownArrow.innerHTML = "▼";
    dropdownArrow.style.cursor = "pointer";
    dropdownArrow.style.fontSize = "10px";
    dropdownArrow.style.marginLeft = "4px";
    dropdownArrow.style.userSelect = "none";

    const dropdownMenu = document.createElement("div");
    dropdownMenu.style.position = "absolute";
    dropdownMenu.style.top = "100%";
    dropdownMenu.style.left = "0";
    dropdownMenu.style.background = "white";
    dropdownMenu.style.border = "1px solid #ccc";
    dropdownMenu.style.padding = "4px 0";
    dropdownMenu.style.display = "none";
    dropdownMenu.style.zIndex = "9999";
    dropdownMenu.style.minWidth = "100px";
    dropdownMenu.className = "tone-menu";

    const tones = ["None", "Professional", "Casual", "Friendly"];
    tones.forEach(tone => {
        const item = document.createElement("div");
        item.innerHTML = tone;
        item.style.padding = "6px 10px";
        item.style.cursor = "pointer";
        item.addEventListener("click", () => {
            container.setAttribute("data-tone", tone.toLowerCase());
            dropdownMenu.style.display = "none";
            console.log("Selected tone:", tone);
        });
        item.addEventListener("mouseover", () => item.style.background = "#f0f0f0");
        item.addEventListener("mouseout", () => item.style.background = "white");
        dropdownMenu.appendChild(item);
    });

    dropdownArrow.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownMenu.style.display = dropdownMenu.style.display === "none" ? "block" : "none";
    });

    document.addEventListener("click", () => {
        dropdownMenu.style.display = "none";
    });

    container.appendChild(button);
    container.appendChild(dropdownArrow);
    container.appendChild(dropdownMenu);

    return container;
}

function injectButton() {
    const existingContainer = document.querySelector(".ai-reply-container");
    if (existingContainer) existingContainer.remove();

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("toolbar not found");
        return;
    }
    console.log("toolbar found creating ai button");

    const container = createAIButton();
    const button = container.querySelector(".ai-reply-button");
    const label = container.querySelector(".ai-reply-label");

    button.addEventListener('click', async () => {
        try {
            label.textContent = "generating..";
            button.disabled = true;

            const emailContent = getEmailContent();
            const selectedTone = container.getAttribute("data-tone") || "professional";

            const response = await fetch("http://localhost:8080/api/email/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: selectedTone
                })
            });

            if (!response.ok) { throw new Error("api request failed"); }

            const generatedReply = await response.text();
            const composeBox = document.querySelector('[role="textbox"]');

            if (composeBox) {
                composeBox.focus();
                document.execCommand("insertText", false, generatedReply);
                if (!composeBox.innerText.includes(generatedReply)) {
                    composeBox.innerText += " " + generatedReply;
                }
            } else {
                console.error("compose box not found");
            }
        } catch (error) {
            console.error(error);
            alert("failed to generate the reply");
        } finally {
            label.textContent = "mail-AI";
            button.disabled = false;
        }
    });

    toolbar.insertBefore(container, toolbar.firstChild);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
const observer = new MutationObserver((mutations) => {

    for (mutation of mutations) {

        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.querySelector('[role="textbox"]') || node.getAttribute("role") === "dialog"));
        if (hasComposeElements) {
            console.log("compose detected");
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
});


