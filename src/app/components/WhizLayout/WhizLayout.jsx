import { WhizSuspense } from "app/components";
import useSettings from "app/hooks/useSettings";
import { WhizLayouts } from "./index";

export default function WhizLayout(props) {
  const { settings } = useSettings();
  const Layout = WhizLayouts[settings.activeLayout];
  // console.log("check layout")
  // console.log(Layout)

  return (
    <WhizSuspense>
      <Layout {...props} />
    </WhizSuspense>
  );
}
