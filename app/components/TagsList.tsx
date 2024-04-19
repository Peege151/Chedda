
const hardcoded_tags = [
    'hip-hop',
    'jazz',
    'rock',
    'disco',
    'city-pop',
    'pop-pop',
    'hyper-pop',
    'bubble-pop',
    'chedda-pop',
]

interface TagsListProps {
    fetchedTags: any; // Adjust the type of fetchedTags if possible
    selectedTags: string[];
    setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>; // Define the correct type for setSelectedTags
}

export const TagsList: React.FC<TagsListProps> = ({ fetchedTags, selectedTags, setSelectedTags }) => {
    //console.log('Fetched Tags?', fetchedTags)
    const tags =fetchedTags.map((tag: any, ind: number) => {
        const selected = selectedTags.indexOf(tag.id) > -1;
        const colorVariants = {
            blue: 'bg-blue-600 hover:bg-blue-500',
            red: 'bg-red-600 hover:bg-red-500',
        }

        return (
            <div key={`key-tag-${ind}`}>
                <label className={`${selected ? colorVariants.blue : colorVariants.red}} flex p-1 mr-0.5 mt-2 border border-black  rounded justify-center`}>
                    <input
                        className="hidden"
                        type='checkbox'
                        name='tags'
                        value={`${tag.id}`}
                        onClick={() => {
                            console.log(tag.id)
                            if (selectedTags.indexOf(tag.id) == -1) {
                                setSelectedTags([
                                    tag.id,
                                    ...selectedTags
                                ])
                            } else {
                                setSelectedTags(
                                    selectedTags.filter((t: string) =>
                                        t !== tag.id
                                    )
                                )
                            }
                        }}
                    // className={`${selected ? colorVariants.blue : colorVariants.red}} flex p-1 w-1/5 mr-0.5 mt-2 border border-black  rounded justify-center`}
                    />
                    {tag.name}
                </label>
            </div >

        )
    })
    return (
        <div className='flex flex-wrap justify-around'>
            {tags}
        </div>
    );
}
