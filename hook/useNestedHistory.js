function useNestedHistory(initialState) {
    const [_, forceRerender] = useState(0);
    const stateRef = useRef(_cloneDeep(initialState));
    const undoStack = useRef([]);
    const redoStack = useRef([]);
  
    const apply = (path, newValue) => {
      const cmd = new UpdateNestedValueCommand(stateRef, path, newValue);
      cmd.execute();
      undoStack.current.push(cmd);
      redoStack.current = [];
      forceRerender(n => n + 1); // Trigger UI update
    };
  
    const undo = () => {
      const cmd = undoStack.current.pop();
      if (cmd) {
        cmd.undo();
        redoStack.current.push(cmd);
        forceRerender(n => n + 1);
      }
    };
  
    const redo = () => {
      const cmd = redoStack.current.pop();
      if (cmd) {
        cmd.execute();
        undoStack.current.push(cmd);
        forceRerender(n => n + 1);
      }
    };
  
    return {
      state: stateRef.current,
      apply,
      undo,
      redo,
    };
  }
  