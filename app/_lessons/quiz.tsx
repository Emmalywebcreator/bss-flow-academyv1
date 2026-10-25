"use client";

import { useRef, useState, type FormEvent } from "react";

export type QuizQuestion = {
  id: string;
  question: string;
  options: readonly string[];
  answer: number;
  explanation: string;
};

/**
 * A multiple-choice knowledge check. Answers live only in this
 * component's state: nothing is saved, and reloading starts afresh.
 */
export function Quiz({ questions }: { questions: readonly QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [missing, setMissing] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const score = questions.filter((q) => answers[q.id] === q.answer).length;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const unanswered = questions.filter((q) => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      setMissing(unanswered.length);
      formRef.current
        ?.querySelector<HTMLInputElement>(`input[name="${unanswered[0].id}"]`)
        ?.focus();
      return;
    }
    setMissing(0);
    setSubmitted(true);
    // Move focus to the score so keyboard and screen reader users hear it.
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  function handleRetry() {
    setAnswers({});
    setSubmitted(false);
    setMissing(0);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ block: "start" });
      formRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {submitted && (
        <div
          ref={resultRef}
          tabIndex={-1}
          role="status"
          className="rounded-2xl border border-accent/50 bg-accent-soft p-5 outline-none"
        >
          <p className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            You scored {score} out of {questions.length}.
          </p>
          <p className="mt-1 text-zinc-700 dark:text-zinc-300">{resultMessage(score, questions.length)}</p>
        </div>
      )}

      <ol className="flex flex-col gap-6">
        {questions.map((q, qi) => {
          const chosen = answers[q.id];
          const correct = chosen === q.answer;
          return (
            <li key={q.id}>
              <fieldset className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
                <legend className="float-left mb-1 w-full font-semibold text-zinc-950 dark:text-zinc-50">
                  {qi + 1}. {q.question}
                </legend>
                <div className="clear-both flex flex-col gap-2">
                  {q.options.map((option, oi) => (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${optionClass(
                        submitted,
                        oi === q.answer,
                        oi === chosen
                      )}`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={oi}
                        checked={chosen === oi}
                        disabled={submitted}
                        onChange={() => setAnswers({ ...answers, [q.id]: oi })}
                        className="mt-0.5 size-4 shrink-0 accent-[var(--accent)] focus-visible:outline-none"
                      />
                      <span className="flex-1 text-zinc-800 dark:text-zinc-200">{option}</span>
                      {submitted && oi === q.answer && (
                        <span className="text-xs font-semibold text-accent">Correct answer</span>
                      )}
                      {submitted && oi === chosen && !correct && (
                        <span className="text-xs font-semibold text-red-700 dark:text-red-400">Your answer</span>
                      )}
                    </label>
                  ))}
                </div>
                {submitted && (
                  <p className="rounded-xl bg-zinc-50 p-4 text-sm leading-6 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                    <strong className={correct ? "text-accent" : "text-red-700 dark:text-red-400"}>
                      {correct ? "Correct." : "Not quite."}
                    </strong>{" "}
                    {q.explanation}
                  </p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>

      {missing > 0 && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400">
          Answer all {questions.length} questions to see your score ({missing} still to go).
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        {submitted ? (
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            Try again
          </button>
        ) : (
          <button
            type="submit"
            className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Check my answers
          </button>
        )}
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Your answers aren&apos;t saved; reloading the page clears them.
        </p>
      </div>
    </form>
  );
}

function optionClass(submitted: boolean, isAnswer: boolean, isChosen: boolean) {
  if (!submitted) {
    return "border-zinc-200 hover:bg-zinc-50 has-[:checked]:border-zinc-950 has-[:checked]:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 dark:has-[:checked]:border-zinc-50 dark:has-[:checked]:bg-zinc-900";
  }
  if (isAnswer) return "cursor-default border-accent bg-accent-soft";
  if (isChosen) return "cursor-default border-red-400 bg-red-50 dark:border-red-800 dark:bg-red-950/40";
  return "cursor-default border-zinc-200 opacity-70 dark:border-zinc-800";
}

function resultMessage(score: number, total: number) {
  if (score === total) return "Excellent: you've completed the knowledge check with every answer right.";
  if (score >= Math.ceil(total * 0.75))
    return "Well done: you've completed the knowledge check. Read the explanations below for the ones you missed.";
  return "You've completed the knowledge check. Review the explanations below, revisit those sections, and try again.";
}
