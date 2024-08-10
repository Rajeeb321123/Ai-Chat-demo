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
        streamMode:'text',
        api: `/api/chat`,
        body: {
            task: translationTask
        },
        onFinish(prompt,completion) {
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
        <div className="mt-4 w-full max-w-4xl flex gap-5">
            <div
                className='relative  w-full flex gap-2 flex-col'
            >
                <div className=' tracking-wider text-xl text-gray-500 ml-2'>
                    {translationTask === 'toNepali' ? "English" : 'Nepali'}
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
                    {translationTask === 'toEnglish' ? "English" : 'Nepali'}
                </div>
                <ScrollArea className='h-full w-full bg-stone-100 px-3  text-base p text-black tracking-wide  border-none outline-none sm:rounded-tr-3xl sm:rounded-b-3xl focus-visible:ring-transparent resize-none py-4 pl-6 pb-12 whitespace-pre-wrap'>
                    {result}
                </ScrollArea>

            </div>
        </div>
    )
}
