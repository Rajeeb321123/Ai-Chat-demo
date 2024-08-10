'use client'
import CopyToClipboard from '@/components/copy-to-clipboard';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Message, useChat, useCompletion } from 'ai/react';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import useAiThinking from '@/hooks/useButtonClick';

export default function GrammarUI() {
    const useAi = useAiThinking();
    
    const grammarChat = useCompletion({
        api: `/api/chat`,
        streamMode: 'text',
        body: {
            task: "grammar"
        },
        onFinish(prompt, completion) {
            setTimeout(() => {
                useAi.onClose()
                grammarChat.setInput(completion)
            }, 2000);
        }
    });

    return (
        <div className="mt-4 w-full max-w-3xl   ">

            <form onSubmit={grammarChat.handleSubmit} className='relative m-1'>
                <Textarea
                    className={cn(
                        "pr-12  text-base  text-black tracking-wide  border-none outline-none rounded-none sm:rounded-3xl bg-stone-200 focus-visible:ring-transparent resize-none py-4 pl-6 h-[70vh] ",

                    )}
                    value={grammarChat.input}
                    placeholder={grammarChat.isLoading || useAi.isOpen ? "" : "NepaliGPT Grammar Correction.."}
                    rows={20}
                    onChange={grammarChat.handleInputChange}
                    lang='nep'
                    spellCheck="true"
                />
                <Button
                    size="icon"
                    type="submit"
                    variant="secondary"
                    disabled={grammarChat.isLoading || grammarChat.input === '' }
                    onClick={() => useAi.onOpen()}
                    className={cn(
                        " absolute right-2 top-0 bottom-0 mt-auto mb-3 h-10 w-10  rounded-full bg-stone-200 group"
                    )}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className='group-disabled:fill-gray-300  fill-gray-700 w-full h-full hover:fill-green-600' x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50"> <path d="M25,2C12.317,2,2,12.317,2,25s10.317,23,23,23s23-10.317,23-23S37.683,2,25,2z M38,36.5c0,0.828-0.672,1.5-1.5,1.5 S35,37.328,35,36.5v-3.192C32.571,36.235,28.935,38,25,38c-7.168,0-13-5.832-13-13s5.832-13,13-13c4.279,0,8.285,2.112,10.716,5.65 c0.469,0.683,0.296,1.617-0.387,2.086c-0.683,0.471-1.615,0.297-2.086-0.387C31.372,16.626,28.29,15,25,15c-5.514,0-10,4.486-10,10 s4.486,10,10,10c3.191,0,6.11-1.525,7.972-4H29.5c-0.828,0-1.5-0.672-1.5-1.5s0.672-1.5,1.5-1.5H37c0.552,0,1,0.448,1,1V36.5z"></path> </svg>
                </Button>
            </form>
        </div>
    )
}
