import { createCohere } from '@ai-sdk/cohere';
import { StreamingTextResponse, streamText } from 'ai';
import { experimental_buildOpenAssistantPrompt } from 'ai/prompts';
import { Client } from "@gradio/client";
const axios = require('axios');

// Define the Flask API URL
const flaskApiUrl = 'http://127.0.0.1:5000/api/receive_data'; // Replace with your actual API endpoint



// Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt, task } = await req.json();

  const value = {
    chat: "",
    toNepali: 'Translate the following sentences or paragraphs to Nepali: ',
    toEnglish: 'Translate the following sentences or paragraphs to English: ',
    grammar: 'Correct the grammar of following sentences or paragraphs given in Nepali or English:'
  }

  // @ts-ignore
  const text = task==='chat'? value[task] + prompt: value[task]+'\n' +'"'+prompt+'"'
  
  console.log(text)

  // Data to send in the request body (modify as needed)
  const requestData = {
    full_prompt:text,
    language:task==='toEnglish'?'English':'Nepali',
    max_tokens:1024,
    temperature:task==='chat'? 0.5:0.2,
    repetition_penalty:task==='chat'? 1.1:1.0,
  };

  let result = '' 
  await axios
    .post(flaskApiUrl, requestData, {
        headers: {
            'Content-Type': 'application/json', // Set the content type
        },
    })
    .then((response:any) => {
        console.log('Response from Flask API:', response.data);
        result = response.data
    })
    .catch((error:any) => {
        console.error('Error making the request:', error.message);
    });


  // const client = await Client.connect("universal-ml/NepaliGPT-16bit",{ hf_token:"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"});
  // const result = await client.predict("/chat", {
  //   message: text,
  //   language: "English",
  //   input: "",
  //   max_tokens: 1,
  //   temperature: 0.1,
  //   top_p: 0.1,
  //   num_beams: 1,
  // });
  // console.log(result)
  // const result = "भूकम्पले क्षतिग्रस्त केशर महल सबलीकरणपछि केशर पुस्तकालय १० वर्षपछि पूर्ववत् अवस्थामा आफ्नै भवनमा सञ्चालनमा आएको छ । पुस्तकालय प्रमुख सुरेशकुमार यादवले भवन सबलीकरण सम्पन्न भएसँगै टहरामा राखिएका सामग्री केशर महलमा सारिएको बताए ।"
  console.log(result)
  // @ts-ignore
  const resp:string = result.data
  
  // VV IMP: cleaning and replacing is done below from here
  // const cleaned = resp.replaceAll(",", "");
  // const chunks = cleaned.split("\n");
  
  // const response = chunks[0];

  var Readable = require("stream").Readable;

  let S = new Readable();
  // S.push(response);
  S.push(resp)
  S.push(null);
  return new StreamingTextResponse(S);
}


// import { HfInference } from '@huggingface/inference';
// import { HuggingFaceStream, StreamingTextResponse } from 'ai';
// import { experimental_buildOpenAssistantPrompt } from 'ai/prompts';

// // Create a new HuggingFace Inference instance
// const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// export async function POST(req: Request) {
//   // Extract the `messages` from the body of the request
//   const { messages, task } = await req.json();

//   console.log(typeof task)
//   const value = {
//     chat: "",
//     toNepali: 'Translate the sentences to Nepali: ',
//     toEnglish: 'Translate the sentences to English: ',
//     grammar: 'Correct the grammer of the given sentence: '
//   }

//   // @ts-ignore
//   // const text = value[task] + messages[messages.length-1].content

//   const full_messages = messages
//   // @ts-ignore
//   full_messages[full_messages.length - 1].content = value[task] + messages[messages.length - 1].content

//   const response = Hf.textGenerationStream({
//     model: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
//     inputs: experimental_buildOpenAssistantPrompt(full_messages),
//     parameters: {
//       max_new_tokens: 200,
//       // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
//       typical_p: 0.2,
//       repetition_penalty: 1,
//       truncate: 1000,
//       return_full_text: false,
//     },
//   });

//   // Convert the response into a friendly text-stream
//   const stream = HuggingFaceStream(response);

//   // Respond with the stream
//   return new StreamingTextResponse(stream);
// }

// export async function POST(req: Request) {
//   const { messages, task } = await req.json();

//   const value = {
//     chat: "",
//     toNepali: 'Translate the sentences to Nepali: ',
//     toEnglish: 'Just do the translation and do not give any other context. Just provide the translated sentences only without any other words. For example,Donot write :The translation of the sentence "Hello" in Nepali is: "नमस्ते" instead write just नमस्ते.  Translate the sentences to English: ',
//     grammar: 'Just correct the grammar and do not give any other context. Just provide the corrected sentences only. Correct the grammer of the given sentence: '
//   }

//   // @ts-ignore
//   const text = value[task] + messages[messages.length - 1].content



//   const client = await Client.connect("universal-ml/NepaliGPT-16bit");
//   const result = await client.predict("/chat", {
//     message: text,
//     language: "English",
//     input: "",
//     max_tokens: 1,
//     temperature: 0.1,
//     top_p: 0.1,
//     num_beams: 1,
//   });

//   console.log(result.data);

//   // @ts-ignore
//   const resp:string = result.data
  
//   // VV IMP: cleaning and replacing is done below from here
//   const cleaned = resp.replaceAll(",", "");
//   const chunks = cleaned.split("\n");
//   const response = chunks[0];

//   var Readable = require("stream").Readable;

//   let S = new Readable();
//   S.push(response);
//   S.push(null);

//   // const full_messages = messages
//   // @ts-ignore
//   // full_messages[full_messages.length - 1].content = value[task] + messages[messages.length - 1].content


//   // console.log(result)
//   return S.toAIStreamResponse();
// }