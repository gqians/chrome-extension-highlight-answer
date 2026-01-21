/***********************
 * 配置
 ***********************/
const RULES_URL =
  "https://raw.githubusercontent.com/yourname/highlight-rules/main/rules.json";

let lastUrl = location.href;
let rulesCache = null;

export const sampleFunction = async () => {
	setTimeout(()=>{
		applyRules()
	},3000)
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			// listen for messages sent from background.js
			if (request.message === 'urlChanged') {
				setTimeout(()=>{
					applyRules()
				},1000)
			}
	});

};
/***********************
 * 判断是否包含文字 a
 ***********************/
function getFullHTMLAsText() {
  // 获取整个 body 的 HTML，然后用正则表达式去除 HTML 标签
  return document.body.outerHTML.replace(/<[^>]*>/g, '').trim();
}

function pageContains(text) {
	const fullText = getFullHTMLAsText();
	console.log(fullText)
	return fullText.includes(text);
}
/***********************
 * 高亮文字 b
 ***********************/
function highlightText(text) {
	console.log(text)
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );

  let node;
	console.log(walker)
  while ((node = walker.nextNode())) {
    // 跳过已经高亮过的
    if (node.parentElement?.dataset?.highlighted) continue;

    if (!node.nodeValue.includes(text)) continue;

    const parts = node.nodeValue.split(text);
    const frag = document.createDocumentFragment();

    parts.forEach((part, index) => {
      frag.appendChild(document.createTextNode(part));

      if (index < parts.length - 1) {
        const span = document.createElement("span");
        span.textContent = text;
        span.style.background = "#00ff1a8e";
        // span.style.color = "black";
				span.style.textDecoration = "underline";
				span.style.textDecorationStyle = "dashed";
				span.style.textDecorationColor = "red";
        span.dataset.highlighted = "1";
        frag.appendChild(span);
      }
    });

    node.parentNode.replaceChild(frag, node);
  }
}
/***********************
 * 执行全部规则
 ***********************/
async function applyRules() {
  const rules = await loadRules();
	console.log(rules)
  rules.forEach(rule => {
    if (pageContains(rule.if)) {
      highlightText(rule.highlight);
    }
  });
}
/***********************
 * 读取 GitHub 规则
 ***********************/
async function loadRules() {
  if (rulesCache) return rulesCache;

  // const res = await fetch(RULES_URL, { cache: "no-store" });
  // const json = await res.json();
  // rulesCache = json.rules || [];
	rulesCache = [
			{
				"if": "Recurrent shoulder instability in a collegiate swimmer. The shoulder slips out during overhead strokes and remains sore for days afterward. Exam shows apprehension with abduction and external rotation, along with generalized laxity. Physical therapy has reduced pain but dislocations continue. Imaging and surgical stabilization options were reviewed to reduce recurrence and restore performance.",
				"highlight": "Orthopedics"
			}
		]
  return rulesCache;
}