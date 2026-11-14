import Pipeline from "../sections/Pipeline";
import PageHead from "../components/PageHead";

export default function StackPage() {
  return (
    <>
      <PageHead
        eyebrow="The stack"
        title="Everything I work with."
        lead="Follow one question from the screen it is typed on to the answer that comes back, and every tool sits at the layer where it actually runs."
      />
      <Pipeline />
    </>
  );
}
