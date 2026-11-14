import Work from "../sections/Work";
import Unshipped from "../sections/Unshipped";
import PageHead from "../components/PageHead";

export default function WorkPage() {
  return (
    <>
      <PageHead
        eyebrow="Work"
        title="Everything I have built."
        lead="The two I would defend line by line first, then the rest of what is deployed, then the ones that never shipped. Every name opens the project itself."
      />
      <Work />
      <Unshipped />
    </>
  );
}
