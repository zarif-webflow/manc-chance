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

    const triggerOpen = () => {
      if (!closedContent) return;

      if (openContent) openContent.classList.remove("is-hidden");
      if (closedContent) closedContent.classList.add("is-hidden");
    };
    const triggerClosed = () => {
      if (!closedContent) return;

      if (openContent) openContent.classList.add("is-hidden");
      if (closedContent) closedContent.classList.remove("is-hidden");
    };

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate!.getTime() - now;

      // If countdown is finished
      if (distance < 0) {
        daysEl.textContent = "0";
        hoursEl.textContent = "0";
        minutesEl.textContent = "0";
        secondsEl.textContent = "0";

        triggerClosed();

        return true; // Countdown finished
      }

      // Calculate time units
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Update display
      daysEl.textContent = String(days);
      hoursEl.textContent = String(hours);
      minutesEl.textContent = String(minutes);
      secondsEl.textContent = String(seconds);

      triggerOpen();

      return false; // Countdown still running
    };

    // Initial update
    const isFinished = updateCountdown();

    // Set interval to update every second if not finished
    if (!isFinished) {
      const intervalId = setInterval(() => {
        const finished = updateCountdown();
        if (finished) {
          clearInterval(intervalId);
        }
      }, 1000);
    }
  }
};

initCountdown();
