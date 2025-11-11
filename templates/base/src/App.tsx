import { useState } from "react";

const App = () => {
  const [projectName, setProjectName] = useState("vitnal-app");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-950 px-6 py-16 text-slate-100">
      <section className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
          Vitnal Start Kit
        </p>
        <h1 className="text-4xl font-bold md:text-5xl">
          Spin up a React + TypeScript project in seconds.
        </h1>
        <p className="max-w-xl text-base text-slate-300 md:text-lg">
          Opinionated defaults, Tailwind styling, and testing utilities included. Edit{" "}
          <code className="rounded bg-slate-800 px-2 py-1 text-sm">src/App.tsx</code> to start
          customizing your new project.
        </p>
      </section>

      <section className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/50">
        <h2 className="text-left text-lg font-semibold text-slate-100">Preview your CLI command</h2>
        <p className="mt-2 text-sm text-slate-400">
          Update the project name to see the generated command you&apos;ll run with the Vitnal CLI.
        </p>
        <div className="mt-6 flex flex-col gap-4">
          <label className="text-sm font-medium text-slate-200" htmlFor="project-name">
            Project name
          </label>
          <input
            id="project-name"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value || "vitnal-app")}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-base text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40"
            placeholder="my-awesome-app"
            autoComplete="off"
          />
          <div className="flex flex-col gap-3 rounded-xl bg-slate-900/70 p-4 text-sm text-slate-300">
            <span className="font-semibold text-slate-200">CLI command</span>
            <code className="rounded-lg bg-slate-950 px-3 py-2 font-mono text-sm text-sky-300 shadow-inner shadow-slate-900">
              npm create vitnal {projectName.trim() || "vitnal-app"}
            </code>
          </div>
        </div>
      </section>
    </main>
  );
};

export default App;
