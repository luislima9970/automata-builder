interface Props {
    symbol: string;
    onSymbolChange: (symbol: string) => void;
}

function TransitionTopbar({ symbol, onSymbolChange }: Props) {

    return (
        <input
            type="text"
            className="topbar-input"
            value={symbol}
            onChange={(e) => onSymbolChange(e.target.value)}
            placeholder="ε"
            maxLength={1}
        />
    );
}

export default TransitionTopbar;