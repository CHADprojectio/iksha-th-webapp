import React, {useEffect, useState} from 'react'

interface TypesComponentProps {
    setCurrentSubType: React.Dispatch<React.SetStateAction<string>>
    currentSubType: string
    types: string[] | null
}
const TypesComponent: React.FC<TypesComponentProps> = ({
                                                           setCurrentSubType,
                                                           currentSubType,
                                                           types,
                                                       }) => {
    const [localType, setLocalType] = useState<string>(currentSubType)

    useEffect(() => {
        if ((types && !currentSubType) || (types && !types.includes(currentSubType))) {
            setLocalType(types[0]);
        } else {
            setLocalType(currentSubType)
        }
    }, [types, currentSubType]);

    if (!types) return

    return (
        <div>
            {types && (
                <div className='flex gap-4 my-5 overflow-x-scroll'>
                    {types.map((item, i) => {
                        if (item == null) {
                            return
                        }
                        return (
                            <div
                                onClick={() => {
                                    setCurrentSubType(item)
                                }}
                                style={{
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    backgroundColor:
                                        localType == item
                                            ? 'var(--tgui--button_color)'
                                            : 'var(--tgui--secondary_fill)',
                                    color: 'var(--tgui--button_text_color)',
                                }}
                                className={`${
                                    localType == item ? '' : ''
                                } px-2 rounded-lg max-w-auto flex justify-center cursor-pointer items-center text-nowrap`}
                                key={i}
                            >
                                <div>{item}</div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default TypesComponent
