import "./App.css";
import React from "react";
import Card from "react-bootstrap/Card";
import { useDrop, useDrag } from "react-dnd";

const alphabet = [
  { value: "a", type: "letter" },
  { value: "b", type: "letter" },
  { value: "c", type: "letter" },
  { value: "d", type: "letter" },
  { value: "e", type: "letter" },
  { value: "f", type: "letter" },
  { value: "g", type: "letter" },
  { value: "h", type: "letter" },
  { value: "i", type: "letter" },
  { value: "j", type: "letter" },
  { value: "k", type: "letter" },
  { value: "l", type: "letter" },
  { value: "m", type: "letter" },
  { value: "n", type: "letter" },
  { value: "o", type: "letter" },
  { value: "p", type: "letter" },
  { value: "q", type: "letter" },
  { value: "r", type: "letter" },
  { value: "s", type: "letter" },
  { value: "t", type: "letter" },
  { value: "u", type: "letter" },
  { value: "v", type: "letter" },
  { value: "w", type: "letter" },
  { value: "x", type: "letter" },
  { value: "y", type: "letter" },
  { value: "z", type: "letter" },
];

export const AlphCard = React.memo(function Box({ value, type, isDropped }) {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type,
      item: { value },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [value, type]
  );
  return (
    <div ref={drag} data-testid="box">
      {isDropped ? (
        <s>{value}</s>
      ) : (
        <Card
          style={{
            background: "white",
            width: 70,
          }}
        >
          <Card.Body>
            <Card.Title>{value}</Card.Title>
          </Card.Body>
        </Card>
      )}
    </div>
  );
});

export const Bin = React.memo(function Bin({
  accept,
  lastDroppedItem,
  onDrop,
}) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = isOver && canDrop;

  return (
    <div ref={drop} style={{ background: "grey", height: 200 }}>
      {isActive ? "Release to drop" : "Drop letters here"}

      {lastDroppedItem && (
        <p>Last dropped: {JSON.stringify(lastDroppedItem)}</p>
      )}
    </div>
  );
});

function App() {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "letter",
    drop: () => ({ name: "Dustbin" }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  const isActive = canDrop && isOver;

  const [isDroppedValues, setDroppedValues] = React.useState([]);
  function isDropped(value) {
    return isDroppedValues.indexOf(value) > -1;
  }

  const handleDrop = React.useCallback(
    (index, item) => {
      const { value } = item;
      setDroppedValues([...isDroppedValues, value]);
    },
    [isDroppedValues]
  );

  function clear() {
    setDroppedValues([]);
  }

  return (
    <div className="App">
      <button onClick={clear}>Clear</button>
      {isDroppedValues}
      <div style={{ overflow: "hidden", clear: "both" }}>
        <Bin
          accept={"letter"}
          lastDroppedItem={null}
          onDrop={(item) => handleDrop(0, item)}
        />
      </div>

      <div
        style={{
          overflow: "hidden",
          clear: "both",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {alphabet.map(({ value, type }, index) => (
          <AlphCard
            value={value}
            type={type}
            name={value}
            // isDropped={isDropped(value)}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
