'use client';

import CopyToClipboard from '@/components/copy-to-clipboard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRightLeft, } from 'lucide-react';

import { cn } from '@/lib/utils';
import useAiThinking from '@/hooks/useButtonClick';
import { Message, useChat, useCompletion } from 'ai/react';
import { useEffect, useMemo, useRef, useState } from 'react';


export default function TranslationUI() {

    const [translationTask, setTranslationTask] = useState<string>('toNepali')
    const [result, setResult] = useState<string>('')
    const useAi = useAiThinking();

    const translationChat = useCompletion({
        streamMode: 'text',
        api: `/api/chat`,
        body: {
            task: translationTask
        },
        onFinish(prompt, completion) {
            setTimeout(() => {
                useAi.onClose()
                console.log(completion)
                // useAi.oninitiateParticleCollapse(true)
                setResult(completion)
                translationChat.setInput(useAi.inputTemp)

            }, 2000);
        }
    });

    return (
        <>
            <div className="hidden md:flex mt-4 w-full max-w-4xl  gap-5">
                <div
                    className='relative  w-full flex gap-2 flex-col'
                >
                    <div className=' tracking-wider text-xl text-gray-500 ml-2'>
                        {translationTask === 'toNepali' ? "English" : 'नेपाली'}
                    </div>

                    <form onSubmit={translationChat.handleSubmit} className=''>
                        <Textarea
                            className={cn(
                                "  text-base   text-black tracking-wide  border-none outline-none rounded-none sm:rounded-tr-3xl sm:rounded-b-3xl bg-stone-200 focus-visible:ring-transparent resize-none py-4 pl-6 m:rounded-tl-none pb-12 ",

                            )}
                            value={translationChat.input}
                            placeholder={translationChat.isLoading || useAi.isOpen === true ? "" : "NepaliGPT translator..."}
                            rows={15}
                            onChange={translationChat.handleInputChange}
                            lang='nep'
                            spellCheck="true"
                        />
                        <Button
                            size="icon"
                            type="submit"
                            variant="secondary"
                            disabled={translationChat.isLoading || translationChat.input === ''}
                            onClick={() => {
                                useAi.onInputTemp(translationChat.input)
                                useAi.onOpen()
                            }}

                            className={cn(
                                " absolute text-base tracking-wide text-white right-2 top-0 bottom-0 mt-auto mb-2 p-2 pr-5 w-fit rounded-md rounded-br-3xl h-fit bg-black hover:bg-green-600"
                            )}
                        >
                            Translate
                        </Button>
                    </form>
                </div>

                <Button
                    className='bg-gray-100 hover:bg-gray-200 rounded-full text-black h-12 w-15 my-auto'
                    onClick={() => {
                        setTranslationTask(translationTask === 'toNepali' ? 'toEnglish' : 'toNepali')
                        let temp = translationChat.input
                        translationChat.setInput(result)
                        setResult(temp)

                    }}
                >
                    <ArrowRightLeft />
                </Button>

                <div className='relative  w-full flex gap-2 flex-col'>

                    <div className=' tracking-wider text-xl text-gray-500 ml-2'>
                        {translationTask === 'toEnglish' ? "English" : 'नेपाली'}
                    </div>
                    <ScrollArea className='h-full w-full bg-stone-100 px-3  text-base p text-black tracking-wide  border-none outline-none sm:rounded-tr-3xl sm:rounded-b-3xl focus-visible:ring-transparent resize-none py-4 pl-6 pb-12 whitespace-pre-wrap'>
                    {result==='' &&
                        <span className='text-muted-foreground'>
                        Translation in 
                        {translationTask === 'toEnglish' ? " English" : ' नेपाली'}...
                        </span> }
                        {result}
                    </ScrollArea>

                </div>
            </div>



            {/* For mobile view  */}
            <div className='md:hidden mt-16 flex justify-center gap-12 items-center relative'>
                <div className=' tracking-wider text-lg text-gray-500 ml-2 w-32 text-end'>
                    {translationTask === 'toNepali' ? "English" : 'Nepali'}
                </div>
                <Button
                    className='bg-gray-100 hover:bg-gray-200 rounded-md text-black h-fit w-15'
                    onClick={() => {
                        setTranslationTask(translationTask === 'toNepali' ? 'toEnglish' : 'toNepali')
                        let temp = translationChat.input
                        translationChat.setInput(result)
                        setResult(temp)

                    }}
                >
                    <ArrowRightLeft />
                </Button>

                <div className=' tracking-wider text-lg text-gray-500 ml-2 w-32 text-start'>
                    {translationTask === 'toEnglish' ? "English" : 'नेपाली'}
                </div>

            </div>
            <div className=" grid md:hidden mt-1 mb-5 w-full max-w-4xl  gap-3  bg-stone-200  grid-rows-2">
                <div className='row-span-1 relative'>
                    <form onSubmit={translationChat.handleSubmit} className=''>
                        <Textarea
                            className={cn(
                                "  text-base   text-black tracking-wide  border-none outline-none rounded-none bg-transparent focus-visible:ring-transparent foucs-visible:ring-of resize-none focus-visible:ring-offset-0",

                            )}
                            value={translationChat.input}
                            placeholder={translationChat.isLoading || useAi.isOpen === true ? "" : "NepaliGPT translator..."}
                            rows={11}
                            onChange={translationChat.handleInputChange}
                            lang='nep'
                            spellCheck="true"
                        />
                        <Button
                            size="icon"
                            type="submit"
                            variant="secondary"
                            disabled={translationChat.isLoading || translationChat.input === ''}
                            onClick={() => {
                                useAi.onInputTemp(translationChat.input)
                                useAi.onOpen()
                            }}

                            className={cn(
                                " absolute text-base tracking-wide text-white right-2 top-0 bottom-0 mt-auto mb-2 p-2  w-fit rounded-md flex my-aut h-fit bg-black hover:bg-green-600"
                            )}
                        >
                            Translate
                        </Button>
                    </form>
                </div>
                <div className='row-span-1 bg-stone-100 relative flex'>
                    <ScrollArea className=' w-full px-3 py-2 bg-transparent text-base  text-black tracking-wide  border-none outline-none focus-visible:ring-transparent resize-none whitespace-pre-wrap'>
                        {result==='' &&
                        <span className='text-muted-foreground'>
                        Translation in 
                        {translationTask === 'toEnglish' ? " English" : ' नेपाली'}...
                        </span> }
                        {result}
                    </ScrollArea>
                </div>
            </div>
        </>
    )
}
