/* ============================================================
   STAMP

   The page needed one way of marking what a thing IS — not
   shipped, three months, forty-eight hours — that costs almost no
   space and still has a voice. A rubber stamp does exactly that
   on a paper record, so that is what this is: mono, boxed in a
   hairline, pressed on a little off square.

   Used in two places on purpose. A device that appears once is a
   flourish; one that appears twice is a vocabulary.
   ============================================================ */

type Props = {
  children: string;
  /* oxblood for a status, quiet for a measurement */
  tone?: "key" | "quiet";
};

export default function Stamp({ children, tone = "key" }: Props) {
  return (
    <span className={"stamp mono" + (tone === "quiet" ? " stamp-q" : "")}>
      {children}
    </span>
  );
}
