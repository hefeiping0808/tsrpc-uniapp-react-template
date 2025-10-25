import {Card} from "antd";
import {useEffect, useState} from "react";
import CardMember from "@/components/Pages/member";


const PageMember = () => {

  useEffect(() => {

  }, []);

  const tabListNoTitle = [
    { key: 'member', label: '会员管理', }, { key: 'points', label: '会员管理', },


  ];
  const [activeTabKey, setActiveTabKey] = useState<string>(tabListNoTitle[0].key);
  const onTab2Change = (key: string) => {
    setActiveTabKey(key);
  };
  const contentListNoTitle: Record<string, React.ReactNode> = {
    member: <CardMember/>
  };
  return <Card
    className="mix-w-full md:w-auto"
    style={{width: 'auto'}}
    tabList={tabListNoTitle}
    activeTabKey={activeTabKey}
    onTabChange={onTab2Change}
    tabProps={{
      size: 'small',
    }}
  >
    {contentListNoTitle[activeTabKey]}
  </Card>
}

export default PageMember;