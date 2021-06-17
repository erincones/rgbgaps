import { Section } from "./section";
import { Subsection } from "./subsection";
import { Button } from "./button";


/**
 * Sidebar component
 */
export const Sidebar = (): JSX.Element => {
  return (
    <ul className="flex-shrink-0 bg-blueGray-100 text-blueGray-800 border-b-8 md:border-b-0 md:border-r-8 border-blueGray-600 overflow-auto md:w-80 h-1/3 md:h-auto">
      <Section title="Camera">
        <li className="flex">
          FOV:
        </li>
        <li className="flex">
          Position:
        </li>
        <li className="flex">
          Direction:
        </li>
      </Section>

      <Section title="Cube">
        <li className="flex">
          Opacity:
        </li>
        <li className="flex">
          Axis:
        </li>
        <li className="flex">
          Grid:
        </li>
      </Section>

      <Section title="Colors" defaultOpen>
        <li className="flex">
          Mode:
        </li>
        <li className="flex">
          Hightlight:
        </li>
        <li className="flex">
          Nearest:
        </li>
        <li className="flex">
          Size:
        </li>
        <li className="flex">
          Target:
        </li>
        <Subsection title="Palette" defaultOpen>
          <li>
            <ul className="flex">
              <li>
                <Button title="Text editor" onClick={undefined}>
                  Raw
                </Button>
              </li>
              <li className="ml-auto">
                <Button title="Export current" onClick={undefined}>
                  Export
                </Button>
              </li>
              <li className="ml-2">
                <Button title="Import" onClick={undefined}>
                  Import
                </Button>
              </li>
            </ul>
          </li>
          <li className="flex">
            Color 1:
          </li>
        </Subsection>
      </Section>
    </ul>
  );
};
