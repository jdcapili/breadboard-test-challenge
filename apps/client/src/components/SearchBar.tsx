type Props = {
    placeholder?: string;
    currentVal: string;
    onChange: (s: string) => void;
}

const SearchBar: React.FC<Props> = ({placeholder, currentVal, onChange}) => {

    const handleChange = (e) => {
        e.preventDefault();
        onChange(e.target.value);
    };

    return <div>
        <input
            type="text"
            placeholder={placeholder || "Search here"}
            onChange={handleChange}
            value={currentVal}
        />
    </div>
}

export default SearchBar