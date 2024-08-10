'use client';

import CopyToClipboard from '@/components/copy-to-clipboard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Message, useChat, useCompletion } from 'ai/react';
import { RefreshCcw, SendHorizontal } from 'lucide-react';
import { FormEvent, useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import useAiThinking from '@/hooks/useButtonClick';
import { AutosizeTextarea } from '@/components/AutoResizableTextArea';
import GrammarUI from '@/components/GrammarUI';
import TranslationUI from '@/components/translationUI';
import { useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';

interface MessageProps {
  role: 'assistant' | 'user',
  content: string,
  id: string
}


export default function Chat() {
  const [selectedTask, setSelectedTask] = useState<string>('chat');
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null)
  const [isFakeStream, setIsFakeStream] = useState(false)
  const [currentAiSpeechMessageId, setcurrentAiSpeechMessageId] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageProps[]>([])



  const {
    completion,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    setInput,
  } = useCompletion({
    streamMode: 'text',
    api: `/api/chat`,
    body: {
      task: 'chat'
    },
    onFinish(prompt, completion) {
      const random = Math.random().toString()
      let resultArray = completion.split(" ")
      console.log(resultArray)

      // for Fake streaming effect
      let i = 0
      let texts = ''
      setIsFakeStream(true)
      const interval = setInterval(() => {
        texts += " " + resultArray[i]
        setMessages((current) => {

          const systemMessage: MessageProps = {
            role: "assistant",
            content: texts,
            id: random
          };

          const temp_current = current.slice(0, current.length - 1)
          return [...temp_current, systemMessage]
        });
        i += 1

        // time is up
        if (i > resultArray.length - 1) {
          setIsFakeStream(false)
          clearInterval(interval);
        }
      }, 200);
      setInput("");
      console.log(messages)
      // so all server component are updated
      // router.refresh();
    }
  });




  const handleNepaliTTS = async (message: Message) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      // setAiSpeaking(true)
      setcurrentAiSpeechMessageId(message.id)
      var synthesis = window.speechSynthesis;

      // Create an utterance object
      var utterance = new SpeechSynthesisUtterance(message.content);
      // var voices = window.speechSynthesis.getVoices();

      // Set utterance properties

      utterance.pitch = 1.5;
      utterance.rate = 1.25;
      utterance.volume = 0.8;
      // utterance.lang = 'en-US'
      // utterance.voice = voices[2]
      utterance.lang = 'ne-NP'

      // Speak the utterance
      synthesis.speak(utterance);

      utterance.onend = () => {
        setcurrentAiSpeechMessageId(null)
      }
    } else {
      console.log('Text-to-speech not supported.');
    }
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {

    const random = (Math.random() * 10000).toString()
    const userMessage: MessageProps = {
      role: 'user',
      content: input,
      id: random
    };
    const systemMessage: MessageProps = {
      role: "assistant",
      content: '',
      id: random
    };
    setMessages((current) => [...current, userMessage, systemMessage])
    handleSubmit(e);

  }

  useEffect(() => {
    if (ref.current == null) return
    ref.current.scrollTo(0, ref.current.scrollHeight)
  }, [messages])

  return (
    <section className="relative">


      <div className=" flex h-screen flex-col items-center justify-center pb-3">
        <div className='flex flex-row justify-start  gap-1 w-full  items-center  px-3 fixed right-0 top-2 left-0 mt-1'>

          <span className="flex" data-state="closed"><button className="h-10 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="icon-xl-heavy"><path d="M15.673 3.913a3.121 3.121 0 1 1 4.414 4.414l-5.937 5.937a5 5 0 0 1-2.828 1.415l-2.18.31a1 1 0 0 1-1.132-1.13l.311-2.18A5 5 0 0 1 9.736 9.85zm3 1.414a1.12 1.12 0 0 0-1.586 0l-5.937 5.937a3 3 0 0 0-.849 1.697l-.123.86.86-.122a3 3 0 0 0 1.698-.849l5.937-5.937a1.12 1.12 0 0 0 0-1.586M11 4A1 1 0 0 1 10 5c-.998 0-1.702.008-2.253.06-.54.052-.862.141-1.109.267a3 3 0 0 0-1.311 1.311c-.134.263-.226.611-.276 1.216C5.001 8.471 5 9.264 5 10.4v3.2c0 1.137 0 1.929.051 2.546.05.605.142.953.276 1.216a3 3 0 0 0 1.311 1.311c.263.134.611.226 1.216.276.617.05 1.41.051 2.546.051h3.2c1.137 0 1.929 0 2.546-.051.605-.05.953-.142 1.216-.276a3 3 0 0 0 1.311-1.311c.126-.247.215-.569.266-1.108.053-.552.06-1.256.06-2.255a1 1 0 1 1 2 .002c0 .978-.006 1.78-.069 2.442-.064.673-.192 1.27-.475 1.827a5 5 0 0 1-2.185 2.185c-.592.302-1.232.428-1.961.487C15.6 21 14.727 21 13.643 21h-3.286c-1.084 0-1.958 0-2.666-.058-.728-.06-1.369-.185-1.96-.487a5 5 0 0 1-2.186-2.185c-.302-.592-.428-1.233-.487-1.961C3 15.6 3 14.727 3 13.643v-3.286c0-1.084 0-1.958.058-2.666.06-.729.185-1.369.487-1.961A5 5 0 0 1 5.73 3.545c.556-.284 1.154-.411 1.827-.475C8.22 3.007 9.021 3 10 3A1 1 0 0 1 11 4"></path></svg></button></span>

          <Select defaultValue={'chat'} onValueChange={value => setSelectedTask(value)} >
            <SelectTrigger className=" hover:bg-gray-200 flex h-8 justify-center gap-3 w-fit tracking-wider text-gray-500 text-base ">
              <SelectValue placeholder="chat" />
            </SelectTrigger>
            <SelectContent className=''>
              <SelectItem value="chat">Chat</SelectItem>
              <SelectItem value="translation">Translation</SelectItem>
              <SelectItem value="grammar">Grammer Correction</SelectItem>
            </SelectContent>
          </Select>
        </div>


        {selectedTask === "grammar" ?
          <GrammarUI />
          :
          <>
            {selectedTask === 'translation' ?
              <TranslationUI />
              :
              <div className="mt-4 w-full max-w-3xl">
                <ScrollArea
                  className='mb-2  h-[75vh]  px-2 pb-2'
                  ref={ref}
                >
                  {!isLoading && messages.length === 0 &&
                    //@ts-ignore
                    <div className='mb-6 flex gap-3' 
                    onMouseOver={(e) => {
                      if (e.currentTarget.getElementsByClassName('avatarImage')[0] !== undefined) {
                        //@ts-ignore
                        e.currentTarget.getElementsByClassName('avatarImage')[0].src = '/animated-robot.gif'
                      }
                    }}
                    onMouseOut={(e) => {
                      if (e.currentTarget.getElementsByClassName('avatarImage')[0] !== undefined) {
                        //@ts-ignore
                        e.currentTarget.getElementsByClassName('avatarImage')[0].src = '/robot.png'
                      }
                    }

                    }>
                      <Avatar>
                        <AvatarImage className='avatarImage' src={'/robot.png'}
                        // onMouseOver={(e)=>e.currentTarget.src='/animated-robot.gif'} onMouseOut={(e)=>e.currentTarget.src='/robot.png'}
                        />
                        <AvatarFallback className='bg-transparent text-white'>
                          
                        </AvatarFallback>
                      </Avatar>
                      <div className=' w-full bg-transparent group pl-3  rounded-md'>
                        <div className='mt-2 text-base tracking-wide text-gray-700 '>
                          नमस्ते, म NepaliGPT हुँ। आज म तपाईंलाई कसरी मद्दत गर्न सक्छु?
                        </div>
                      </div>
                    </div>
                  }
                  {messages.map(m => (
                    <div key={m.id} className=' whitespace-pre-wrap'>
                      {m.role === 'user' && (
                        <div className='mb-5 flex gap-3  justify-end '>
                          <div className='flex flex-row-reverse mt-1.5 gap-2 items-center group px-2'>
                            <div className=' bg-stone-100 px-4 py-2 rounded-2xl  '>
                              <div className='mx-auto text-base text-black  tracking-wide '>
                                {m.content}
                              </div>
                            </div>
                            <button
                              className='hidden group-hover:block hover:bg-stone-200 rounded-full w-fit bg-transparent transition'
                              onClick={() => setInput(m.content)}
                            >

                              <RefreshCcw className=' rounded-full p-2 text-gray-500 h-9 w-9 ' />
                            </button>
                          </div>
                        </div>
                      )}

                      {m.role === 'assistant' && (

                        <div className='mb-6 flex gap-3'
                          onMouseOver={(e) => {
                            if (e.currentTarget.getElementsByClassName('avatarImage')[0] !== undefined) {
                              //@ts-ignore
                              e.currentTarget.getElementsByClassName('avatarImage')[0].src = '/animated-robot.gif'
                            }
                          }}
                          onMouseOut={(e) => {
                            if (e.currentTarget.getElementsByClassName('avatarImage')[0] !== undefined) {
                              //@ts-ignore
                              e.currentTarget.getElementsByClassName('avatarImage')[0].src = '/robot.png'
                            }
                          }
                          }>
                          <Avatar>
                            <AvatarImage className='avatarImage' src={'/robot.png'}
                            // onMouseOver={(e)=>e.currentTarget.src='/animated-robot.gif'} onMouseOut={(e)=>e.currentTarget.src='/robot.png'}
                            />
                            <AvatarFallback className='bg-transparent text-white'>
                              AI
                            </AvatarFallback>
                          </Avatar>
                          <div className=' w-full bg-transparent group pl-3  rounded-md'>
                            <div className='mt-2 text-base tracking-wide text-gray-700 '>
                              {isLoading && messages[messages.length - 1].id === m.id
                                ? (<BeatLoader
                                  size={5}
                                  color={'black'} />)
                                : m.content
                              }
                            </div>
                            <div className='mt-2 w-full flex items-center justify-start gap-3'>
                              {currentAiSpeechMessageId === m.id ?
                                <button className='w-fit items-center flex hover:bg-stone-200 rounded-sm' onClick={() => {
                                  window.speechSynthesis.cancel()
                                  setcurrentAiSpeechMessageId(null)
                                }

                                }>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" className="fill-zinc-500 p-0.5"><path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12m7.5-3.5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1z" clipRule="evenodd"></path></svg>
                                </button>
                                :
                                <button className='w-fit items-center flex hover:bg-stone-200 rounded-sm' onClick={() => handleNepaliTTS(m)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" className="fill-zinc-500 p-0.5"><path d="M11 4.91a.5.5 0 0 0-.838-.369L6.676 7.737A1 1 0 0 1 6 8H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2a1 1 0 0 1 .676.263l3.486 3.196A.5.5 0 0 0 11 19.09zM8.81 3.067C10.415 1.597 13 2.735 13 4.91v14.18c0 2.175-2.586 3.313-4.19 1.843L5.612 18H4a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h1.611zm11.507 3.29a1 1 0 0 1 1.355.401A10.96 10.96 0 0 1 23 12c0 1.85-.458 3.597-1.268 5.13a1 1 0 1 1-1.768-.934A8.96 8.96 0 0 0 21 12a8.96 8.96 0 0 0-1.085-4.287 1 1 0 0 1 .402-1.356M15.799 7.9a1 1 0 0 1 1.4.2 6.48 6.48 0 0 1 1.3 3.9c0 1.313-.39 2.537-1.06 3.56a1 1 0 0 1-1.673-1.096A4.47 4.47 0 0 0 16.5 12a4.47 4.47 0 0 0-.9-2.7 1 1 0 0 1 .2-1.4" clipRule="evenodd"></path></svg>
                                </button>
                              }
                              <CopyToClipboard message={m} className=' w-fit items-center flex' />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                </ScrollArea>



                <form onSubmit={onSubmit} className='absolute w-full max-w-3xl mx-auto bottom-2 left-0 right-0 mb-2'>

                  <AutosizeTextarea
                    className={cn(
                      "pr-12  pt-3 my-auto tracking-wide  text-black   border-none outline-none sm:rounded-3xl rounded-none bg-stone-200 focus-visible:ring-transparent resize-none pl-6 text-base ",

                    )}
                    value={input}
                    placeholder={isLoading ? "" : "NepaliGPT playground..."}

                    onChange={handleInputChange}
                    lang='nep'
                    spellCheck="true"
                  />
                  <Button
                    size="icon"
                    type="submit"
                    variant="secondary"
                    disabled={isLoading || input === ''}
                    // onClick={() => useAi.onOpen()}
                    className={cn(
                      "  disabled:bg-gray-300  absolute right-2 top-0 bottom-0 mt-auto mb-3 h-9 w-9 bg-black rounded-full hover:bg-green-600",
                      selectedTask !== 'grammar' && 'm-auto'
                    )}
                  >
                    <SendHorizontal className='h-5 w-5 text-white' />
                  </Button>
                </form>
              </div>
            }
          </>

        }



      </div>
    </section>
  );
}