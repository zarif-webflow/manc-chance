import { getHtmlElement, getMultipleHtmlElements } from "@taj-wf/utils";

const selectors = {
  countdownWrap: "[countdown=wrap]",
  openContent: "[countdown=open-content]",
  closedContent: "[countdown=closed-content]",
  days: "[countdown=days]",
  hours: "[countdown=hours]",
  minutes: "[countdown=minutes]",
  seconds: "[countdown=seconds]",
} as const;

const properties = {
  time: "countdown-time",
} as const;

const initCountdown = () => {
  const countdownWraps = getMultipleHtmlElements({
    selector: selectors.countdownWrap,
    log: "error",
  });

  if (!countdownWraps) return;

  for (const countdownWrap of countdownWraps) {
    const targetTime = countdownWrap.getAttribute(properties.time);
    if (!targetTime) {
      console.error("No target time specified for countdown within", countdownWrap);
      continue;
    }

    let targetDate: Date | null = null;

    try {
      targetDate = new Date(targetTime);

      if (isNaN(targetDate.getTime())) {
        throw new Error();
      }
    } catch {
      console.error("Invalid target time was inserted!", countdownWrap);
      continue;
    }

    const daysEl = getHtmlElement({
      selector: selectors.days,
      parent: countdownWrap,
      log: "error",
    });
    const hoursEl = getHtmlElement({
      selector: selectors.hours,
      parent: countdownWrap,
      log: "error",
    });
    const minutesEl = getHtmlElement({
      selector: selectors.minutes,
      parent: countdownWrap,
      log: "error",
    });
    const secondsEl = getHtmlElement({
      selector: selectors.seconds,
      parent: countdownWrap,
      log: "error",
    });

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) continue;

    const openContent = getHtmlElement({
      selector: selectors.openContent,
      parent: countdownWrap,
      log: "debug",
    });
    const closedContent = getHtmlElement({
      selector: selectors.closedContent,
      parent: countdownWrap,
      log: "debug",
    });
  }
};

initCountdown();
