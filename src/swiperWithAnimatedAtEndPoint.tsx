import React, { useCallback, useState, ReactComponentElement } from "react";

interface IPropType {
    data: any[];
    sliderWidth: number;
    itemWidth: number;
    initialIndex?: number;
    renderItems: (data: any, index: number, activeIndex: number) => ReactComponentElement<any, any>;
    renderDots?: (activeIndex: number) => ReactComponentElement<any, any>;
    swiperRatioAtStart?: number;
    swiperRatioAtEnd?: number;
    callbackAtEnd?: () => void;
    callbackAtStart?: () => void;
    swiperAnimationAtStart?: () => void;
    swiperAnimationAtEnd?: () => void;
}
export default function SwiperWithAnimateAtEndPoint({data, sliderWidth, itemWidth, initialIndex= 0}: IPropType) {
    const [positionList, setPositionList] = useState([] as number[]);
    const [timeStampList, setTimeStampList] = useState([] as number[]);
    const [translateX, setTranslateX] = useState(-initialIndex * sliderWidth);
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const [status, setStatus] = useState("touchMove" as "touchMove" | "touchEnd");
    const getSpeed = useCallback(() => (positionList[2] - positionList[1]) / (timeStampList[2] - timeStampList[1]), [positionList, timeStampList]);
    const onSnap = (index: number) => {
        setActiveIndex(index);
        setTranslateX(-index * innerWidth;
    }
    const onTouchEnd = useCallback(() => {
        // 计算一下速度， 然后速度加位置大于某一个值， 则直接划过去
        // event.pageX
        // console.log("onTouchEnd", positionList, timeStampList);
        
        const speed = getSpeed();
        setStatus("touchEnd");
        switch (true) {
            case speed <= 0 && activeIndex < 2 && (speed * 5 + ((positionList[2] - positionList[0]) - activeIndex * innerWidth) / innerWidth) < -0.5:
                onSnap(activeIndex + 1);
                break;
            
            case speed >= 0 && activeIndex > 0 && (speed * 5 + ((positionList[2] - positionList[0])- activeIndex * innerWidth) / innerWidth) > 0.5:
                onSnap(activeIndex - 1);
                break;
            
            default:
                onSnap(activeIndex);
                break;
        }
    }, [activeIndex, getSpeed, positionList]);
    return (
        <div>
            <div
                style={{
                    overflowX: "hidden",
                    overflowY: "hidden",
                    width: outerWidth
                }}
                onTouchStart={() => {
                    setStatus("touchMove");
                    setPositionList([]);
                }}
                onTouchMove={(event) => {
                    // 留下第一个用来计算偏移距离
                    // 最后两个用来计算速度
                    // 有第一个则保留
                    // 有第二个则
                    setTimeStampList(timeStampList.length <= 2 ? [...timeStampList, event.timeStamp] : [timeStampList[0], timeStampList[2], event.timeStamp]);
                    setPositionList(positionList.length <= 2 ? [...positionList, event.touches[0].pageX] : [positionList[0], positionList[2], event.touches[0].pageX]);
                    // 如果在第一个的话, 采用过滤函数can
                    const realTimeTranslateX = (() => {
                        switch (true) {
                            case activeIndex === 0 && positionList[2] - positionList[0] > 0:
                                return (1 - Math.exp(-(positionList[2] - positionList[0]) / innerWidth)) * 0.4 * innerWidth;
                            
                            case activeIndex === 2 && positionList[2] - positionList[0] < 0:
                                return -(1 - Math.exp((positionList[2] - positionList[0]) / innerWidth)) * 0.4 * innerWidth - 2 * innerWidth;
                            
                            default:
                                return positionList[2] - positionList[0] - activeIndex * innerWidth;
                        }
                    })();
                    setTranslateX(realTimeTranslateX);
                }}
                onTouchEnd={onTouchEnd}
            >
                <div
                    className="App"
                    style={{
                        width: outerWidth * 3,
                        display: "flex",
                        flexDirection: "row",
                        transition: `all ${status === "touchEnd" ? 0.3 : 0}s ease-in`,
                        // transform: "translate(100px, 0px)",
                        transform: `translate(${translateX}px, 0px)`,
                    }}
                >
                    <div
                        style={{
                            width: outerWidth - 2,
                            height: 100,
                            border: "1px solid black",
                            display: "flex",
                            fontSize: 100,
                            color: "red",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
            1
                    </div>
                    <div
                        style={{
                            width: outerWidth - 2,
                            height: 100,
                            fontSize: 100,
                            color: "red",
                            border: "1px solid black",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
            2
                    </div>
                    <div
                        style={{
                            width: outerWidth - 2,
                            height: 100,
                            fontSize: 100,
                            color: "red",
                            border: "1px solid black",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
            3
                    </div>
                </div>
            </div>
            <div
                style={{
                    width: innerWidth,
                    height: innerHeight,
                    backgroundColor: "yellow"
                }}
            />
        </div>
    );
}

