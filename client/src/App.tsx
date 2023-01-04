import "./App.css";
import {
  Box,
  CheckIcon,
  ColorSwatch,
  Group,
  List,
  ThemeIcon,
} from "@mantine/core";
import useSWR, { KeyedMutator } from "swr";
import AddTodo, { Todo } from "./AddTodo";
import { useState } from "react";
import { CheckCircleFillIcon } from "@primer/octicons-react";

export const ENDPOINT = "http://localhost:3000";

function App() {
  const [checked, setChecked] = useState(false);

  const fetcher = (url: string) =>
    fetch(`${ENDPOINT}${url}`).then((res) => res.json());

  const { data, error, mutate } = useSWR<any>("/api/todos", fetcher);

  if (error) return "An error has occurred.";
  if (!data) return "Loading...";

  async function handleUpdateToDone(id: string | number) {
    const patchData = await fetch(`${ENDPOINT}/api/todos/${id}/done`, {
      method: "PATCH",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      // body: JSON.stringify({ done: true }),
    }).then((r) => {
      r.json();
      setChecked(true);
    });

    mutate(patchData);
  }

  return (
    <Box>
      <AddTodo mutate={mutate} />
      <div>
        {data.length > 0 ? (
          data?.map((todo: Todo, index: number) => {
            return (
              // <Group position="center" spacing="xl" grow>
              <>
                {console.log(todo.done)}
                <List
                  spacing="xs"
                  size="sm"
                  center
                  // icon={
                  //   <ThemeIcon color="teal" size={24} radius="xl">
                  //     <CheckCircleFillIcon size={16} />
                  //   </ThemeIcon>
                  // }
                >
                  <List.Item onClick={() => handleUpdateToDone(todo.id)}>
                    {todo.done ? (
                      <>
                        <CheckCircleFillIcon size={16} />
                        <h2 style={{ padding: "20px" }}>{todo.title}</h2>
                        <span>{todo.body}</span>
                      </>
                    ) : (
                      <>
                        <h2 style={{ padding: "20px" }}>{todo.title}</h2>
                        <span>{todo.body}</span>
                      </>
                    )}
                  </List.Item>
                </List>
                {/* </div> */}
                {/* </ColorSwatch> */}
              </>
            );
          })
        ) : (
          <p>no data...</p>
        )}
      </div>
    </Box>
  );
}

export default App;
