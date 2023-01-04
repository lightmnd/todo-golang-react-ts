import React, { useState } from "react";
import {
  Modal,
  Group,
  Button,
  Box,
  TextInput,
  Text,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ENDPOINT } from "./App";
import { KeyedMutator } from "swr";

export interface Todo {
  id: number | string;
  title: string;
  done: false;
  body: string;
}

export default function AddTodo({
  mutate,
}: {
  mutate: KeyedMutator<Todo[]> | any;
}) {
  const [opened, setOpened] = useState(false);

  const form = useForm({
    initialValues: {
      title: "",
      //done: false,
      body: "",
    },
    // validate: {
    //   email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    // },
  });

  async function handleSubmit(values: { title: string; body: string }) {
    try {
      const postData = await fetch(`${ENDPOINT}/api/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const res = await postData.json();
      mutate(postData);
      form.reset();
      setOpened(false);
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add a task!"
      >
        <Box sx={{ maxWidth: 300 }} mx="auto">
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <TextInput
              label="title"
              placeholder="title of task"
              {...form.getInputProps("title")}
            />
            <Textarea
              mb={30}
              label="body"
              placeholder="describe your task"
              {...form.getInputProps("body")}
            />
            <Group position="center">
              <Button type="submit" onClick={() => handleSubmit}>
                Submit
              </Button>
              <Button onClick={() => setOpened(false)}>Cancel</Button>
            </Group>
          </form>
        </Box>
      </Modal>
      <Group position="center">
        <Button onClick={() => setOpened(true)}>Open Modal</Button>
      </Group>
    </>
  );
}
