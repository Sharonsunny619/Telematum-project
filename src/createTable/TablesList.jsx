import {
  ActionIcon,
  Box,
  Card,
  Center,
  Container,
  Flex,
  Group,
  Menu,
  NativeSelect,
  Pagination,
  Paper,
  rem,
  ScrollArea,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { useEffect, useRef } from "react";
import { DateInput, TimeInput } from "@mantine/dates";
import axios from "axios";
import {
  IconCalendar,
  IconChevronDown,
  IconCircleCheck,
  IconClock,
  IconDeviceFloppy,
  IconDotsVertical,
  IconPencil,
  IconStarFilled,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import "@mantine/dates/styles.css";

const Layout = () => {
  const form = useForm({
    initialValues: {
      data: [],
      itemsPerPage: 5,
      currentPage: 1,
      isPostponeClicked: false,
      postponeElementId: null,
      selectedDataToEdit: null,
      editedTime: null,
      editedDate: null,
      acceptedData: false,
      acceptedItems: [],
    },
  });

  const ref = useRef(null);
  const startIndex = (form.values.currentPage - 1) * form.values.itemsPerPage;
  const endIndex = form.values.currentPage * form.values.itemsPerPage;
  const totalPages = Math.ceil(
    form.values.data.length / form.values.itemsPerPage
  );
  const pickerControl = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => ref.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const invokeData = async () => {
    const response = await axios({
      url: `https://gist.githubusercontent.com/telematum/7751eec667033ac8acd244542e464e18/raw/d4710c6fb54224a0bd316ecdc5246633aceefce5/todays.json`,
    });
    form.setFieldValue("data", response.data.appointments);
  };

  const handleItemsPerPageChange = (event) => {
    form.setFieldValue("itemsPerPage", parseInt(event.target.value, 10));
    form.setFieldValue("currentPage", 1);
  };

  const handlePageChange = (page) => {
    form.setFieldValue("currentPage", page);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const onHandleColor = (index) => {
    if (index === 1) return "red";
    else if (index === 2) return "green";
    else if (index === 3) return "yellow";
    else if (index === 4) return "grey";
    else return "blue";
  };

  const onHandleDelete = (element) => {
    const updatedData = form.values.data.filter(
      (item) => item.patient_name !== element.patient_name
    );
    form.setValues({
      ...form.values,
      data: updatedData,
    });
  };

  const onHandlePostpone = (index) => {
    form.setFieldValue("selectedDataToEdit", index);
    form.setFieldValue("isPostponeClicked", true);
    form.setFieldValue("editedTime", null);
    form.setFieldValue("editedDate", null);
  };

  const onHandleChangeTimeAndDate = (patient, type) => {
    const updatedData = form.values.data.map((item) =>
      item.patient_name === patient.patient_name
        ? {
            ...item,
            appointment_date: form.values.editedDate,
            appointment_time: form.values.editedTime,
          }
        : item
    );
    form.setFieldValue("data", updatedData);

    form.setFieldValue("isPostponeClicked", false);
  };

  const onHandleAccept = (element) => {
    form.setFieldValue("acceptedItems", (prevAcceptedItems) => [
      ...prevAcceptedItems,
      element.patient_name,
    ]);
  };

  useEffect(() => {
    invokeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container fluid>
        <Card radius={30} h="50%" w="100%" p={40} mt={20} withBorder>
          <Text fz={20} c="#7A7A9D" fw={600}>
            Today's Appointment List
          </Text>
          <ScrollArea mt={20}>
            <Table
              miw={700}
              highlightOnHover
              styles={{
                thead: {
                  backgroundColor: "#FAFBFA",
                  height: rem(55),
                  color: "#8492A6",
                },
                tbody: {
                  color: "#425567",
                  backgroundColor: "#FEFEFF",
                  fontSize: rem(14),
                  fontWeight: 400,
                  justifyContent: "center",
                },
              }}
              verticalSpacing={8}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th
                    fw={600}
                    fz={12}
                    style={{
                      borderTopLeftRadius: rem(20),
                      textAlign: "left",
                      paddingLeft: 15,
                    }}
                  >
                    PATIENTS
                  </Table.Th>
                  <Table.Th fw={600} fz={12} style={{ textAlign: "left" }}>
                    DATE
                  </Table.Th>
                  <Table.Th fw={600} fz={12} style={{ textAlign: "left" }}>
                    TIME
                  </Table.Th>
                  <Table.Th fw={600} fz={12} style={{ textAlign: "left" }}>
                    DOCTOR
                  </Table.Th>
                  <Table.Th fw={600} fz={12} style={{ textAlign: "left" }}>
                    INJURY
                  </Table.Th>
                  <Table.Th
                    fw={600}
                    fz={12}
                    style={{
                      borderTopRightRadius: rem(20),
                      textAlign: "center",
                    }}
                  >
                    ACTION
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody className="_table">
                {form.values.data
                  .slice(startIndex, endIndex)
                  .map((element, index) => (
                    <Table.Tr
                      key={index}
                      style={{
                        backgroundColor: form.values.acceptedItems.includes(
                          element.patient_name
                        )
                          ? "lightgreen"
                          : "transparent",
                      }}
                    >
                      <Table.Td style={{ textAlign: "left", paddingLeft: 15 }}>
                        <Flex gap={5} align="center">
                          <ActionIcon
                            key={index}
                            color={onHandleColor(index)}
                            h={40}
                            w={40}
                            radius="xl"
                            variant="filled"
                          >
                            <IconUser />
                          </ActionIcon>
                          <Stack gap={0}>
                            <Text fz={16} fw={600} c="#27272E">
                              {element.patient_name}
                            </Text>
                            <Text fz={14} c="#425567">
                              {element.mobile_number}
                            </Text>
                          </Stack>
                        </Flex>
                      </Table.Td>
                      <Table.Td style={{ textAlign: "left" }}>
                        {form.values.selectedDataToEdit === index &&
                        form.values.isPostponeClicked ? (
                          <DateInput
                            w={200}
                            {...form.getInputProps("editedDate")}
                          />
                        ) : (
                          <Flex gap={5} align="center" c="#425567">
                            <IconCalendar stroke={1} />
                            {formatDate(element.appointment_date)}
                          </Flex>
                        )}
                      </Table.Td>
                      <Table.Td style={{ textAlign: "left" }}>
                        {form.values.selectedDataToEdit === index &&
                        form.values.isPostponeClicked ? (
                          <TimeInput
                            w={100}
                            ref={ref}
                            rightSection={pickerControl}
                            {...form.getInputProps("editedTime")}
                          />
                        ) : (
                          <Flex gap={5} align="center" c="#425567">
                            <IconClock stroke={1} />
                            {element.appointment_time.split(" ")[0]}
                          </Flex>
                        )}
                      </Table.Td>
                      <Table.Td style={{ textAlign: "left" }}>
                        <Flex gap={5} align="center">
                          <Paper
                            w={20}
                            h={20}
                            bg={index < 3 ? "red" : "green"}
                            radius="xl"
                          >
                            <Center>
                              <Box mt={1}>
                                <IconStarFilled color="#fff" size={14} />
                              </Box>
                            </Center>
                          </Paper>
                          <Text c="#425567">{element.doctor}</Text>
                        </Flex>
                      </Table.Td>
                      <Table.Td style={{ textAlign: "left" }}>
                        <Paper
                          bg="#E4ECF7"
                          w={element.injury.length * 9}
                          px={6}
                          py={4}
                        >
                          <Center fw={600} c="#505780">
                            {element.injury}
                          </Center>
                        </Paper>
                      </Table.Td>
                      <Table.Td style={{ textAlign: "left" }}>
                        <Flex gap={5}>
                          {form.values.selectedDataToEdit === index &&
                          form.values.isPostponeClicked ? (
                            <ActionIcon
                              bg="#E4ECF7"
                              c="blue"
                              disabled={form.values.editedDate === null}
                              h={36}
                              w={30}
                              onClick={() =>
                                onHandleChangeTimeAndDate(element, "date")
                              }
                            >
                              <IconDeviceFloppy />
                            </ActionIcon>
                          ) : (
                            <Menu
                              width={180}
                              position="bottom-end"
                              trigger="click"
                            >
                              <Menu.Target>
                                <Center>
                                  <ActionIcon
                                    variant="subtle"
                                    radius={400}
                                    color="#DAE3F1"
                                  >
                                    <IconDotsVertical stroke={1.8} size={25} />
                                  </ActionIcon>
                                </Center>
                              </Menu.Target>
                              <Menu.Dropdown w="8%">
                                {!form.values.acceptedItems.includes(
                                  element.patient_name
                                ) && (
                                  <Menu.Item
                                    fz={10}
                                    leftSection={<IconCircleCheck size={12} />}
                                    onClick={() => onHandleAccept(element)}
                                  >
                                    Accept
                                  </Menu.Item>
                                )}
                                {!form.values.acceptedItems.includes(
                                  element.patient_name
                                ) && (
                                  <Menu.Item
                                    fz={10}
                                    leftSection={<IconPencil size={12} />}
                                    onClick={() => onHandlePostpone(index)}
                                  >
                                    Postpone
                                  </Menu.Item>
                                )}
                                <Menu.Item
                                  fz={10}
                                  leftSection={<IconTrash size={12} />}
                                  onClick={() => onHandleDelete(element)}
                                >
                                  Delete
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          )}
                        </Flex>
                      </Table.Td>
                    </Table.Tr>
                  ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
          <Flex
            justify="center"
            mt={20}
            direction={{ base: "column", sm: "column", md: "row", lg: "row" }}
          >
            <Pagination.Root
              total={totalPages}
              value={form.values.currentPage}
              onChange={handlePageChange}
              styles={{
                control: {
                  fontSize: 13,
                  borderRadius: 20,
                  background: "#E4ECF7",
                  border: "none",
                  color: "#505780",
                },
              }}
            >
              <Group gap={5} justify="center">
                <Pagination.Previous />
                <Pagination.Items />
                <Pagination.Next />
              </Group>
            </Pagination.Root>
            <Flex justify="center">
              <NativeSelect
                w={{ base: 80, md: "100%", lg: "100%" }}
                ml={15}
                value={form.values.itemsPerPage}
                onChange={handleItemsPerPageChange}
                rightSection={
                  <IconChevronDown color="#505780" size={18} stroke={1} />
                }
                mt={{ base: 5, md: -3, lg: -3 }}
                data={["10", "5", "2", "1"]}
                styles={{
                  input: {
                    fontSize: 13,
                    backgroundColor: "#E4ECF7",
                    color: "#505780",
                    border: "none",
                  },
                }}
              />
            </Flex>
          </Flex>
        </Card>
      </Container>
    </>
  );
};

export default Layout;
