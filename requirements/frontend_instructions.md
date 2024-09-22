# Project overview
Use this guide to build a web app where users can give a text prompt to generate emoji using a model hosted on Replicate.

# Feature requirements
- We will use Next.js, Shadcn, Lucid, Supabase, Clerk
- Create a form where users can put in a prompt, and clicking on a button that calls the Replicate model to generate emoji
- Have a nice UI & animation when the emoji is blank or generating
- Display all the images ever generated in a grid
- When hovering over each emoji image, an icon button for download and an icon button for like should show up

# Relevant docs
## How to use replicate emoji generator model
Set the REPLICATE_API_TOKEN environment variable

$ export REPLICATE_API_TOKEN=<paste-your-token-here>

Install Replicate’s Node.js client library

$ npm install replicate

Run fofr/sdxl-emoji using Replicate’s API. Check out the model's schema for an overview of inputs and outputs.

import Replicate from "replicate";
const replicate = new Replicate();

const input = {
    prompt: "A TOK emoji of a man",
    apply_watermark: false
};

const output = await replicate.run("
  fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e", 
  {
    input: {
      width: 1024,
      height: 1024,
      prompt: "A TOK emoji of a man",
      refine: "no_refiner",
      scheduler: "K_EULER",
      lora_scale: 0.6,
      num_outputs: 1,
      guidance_scale: 7.5,
      apply_watermark: false,
      high_noise_frac: 0.8,
      negative_prompt: "",
      prompt_strength: 0.8,
      num_inference_steps: 50
    }
  }
);

# Current File structure
EMOJI-GENERATOR-CURSOR
└── emoji-maker
    ├── .next
    ├── app
    │   ├── fonts
    │   └── globals.css
    ├── components
    │   └── ui
    │       ├── button.tsx
    │       ├── card.tsx
    │       └── input.tsx
    ├── lib
    │   └── utils.ts
    ├── node_modules
    ├── requirements
    │   └── frontend_instructions.md
    ├── .eslintrc.json
    ├── .gitignore
    ├── components.json
    ├── emoji-generator-cursor.code-workspace
    ├── next-env.d.ts
    ├── next.config.mjs
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    ├── README.md
    ├── tailwind.config.ts
    └── tsconfig.json

# Rules
- All new components should go in /components and be named like example-component.tsx unless otherwise specified
- All new pages should go in /app unless otherwise specified
