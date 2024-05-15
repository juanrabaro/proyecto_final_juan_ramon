<script>
  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";
  import ComponentDnd from "../../lib/ComponentDND.svelte";

  let itemsOrder = [];
  if (typeof window !== "undefined") {
    itemsOrder = JSON.parse(window.localStorage.getItem("itemsOrder")) || [];
  }
  console.log(itemsOrder);

  let items = [
    { _id: 1, name: "item1" },
    { _id: 2, name: "item2" },
    { _id: 3, name: "item3" },
    { _id: 4, name: "item4" },
  ];
  items = items.map((item) => {
    const newItem = { ...item, id: item._id };
    delete newItem._id;
    return newItem;
  });

  items.sort((a, b) => itemsOrder.indexOf(a.id) - itemsOrder.indexOf(b.id));

  const flipDurationMs = 300;
  function handleDndConsider(e) {
    items = e.detail.items;
  }
  function handleDndFinalize(e) {
    items = e.detail.items;
    window.localStorage.setItem(
      "itemsOrder",
      JSON.stringify(items.map((item) => item.id)),
    );
  }
</script>

<h2>nose ya</h2>
<section
  use:dndzone={{ items, flipDurationMs }}
  on:consider={handleDndConsider}
  on:finalize={handleDndFinalize}
>

  {#each items as item (item.id)}
    <!-- <div animate:flip={{ duration: flipDurationMs }}>{item.name}</div> -->
    <div animate:flip={{ duration: flipDurationMs }}>
      <ComponentDnd {item} />
    </div>
  {/each}
</section>

<style>
  section {
    width: 50%;
    padding: 0.3em;
    border: 1px solid black;
    /* this will allow the dragged element to scroll the list although starting in version 0.9.41 the lib would detect any scrollable parent*/
    overflow: scroll;
    height: 200px;
  }
</style>
