#! /bin/bash

# --max_old_space_size=4096

pd="pms123456"

echo -n "需要打包(y/n):"
read pack


base="192.168.11."
result="n"
url_arr=()

while [[ $result == "n" || $result == "N" ]]
   do
    url_arr=()
    whole=""
    index=0
    current="true"

    while [ $current == "true" ]
        do 
        echo -n "输入服务器地址后两位，结束输入n："
        read url
        if [[ $url == "n" ]];
        then    
            current="false"
        else
            url_arr[index]=$url
            index=$((index+1))
        fi
    done

    for url in ${url_arr[@]}
    do
        whole=$whole$url","
    done

    echo -n "发布到 $whole(Y/N):"
    read res
    result=$res
done

echo "配置完成"

start=$(date +"%Y-%m-%d %H:%M:%S")
if [[ $pack == "y" || $pack == "" ]]; 
then 
    echo "正在打包....."
    pnpm build
    echo "☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆★打包完成★☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆"
fi


    for url in ${url_arr[@]}
    do
        sshpass -p $pd ssh pms@192.168.11.$url '
            cd /install/goview/static/;
            rm -rf /install/goview/static/*;
            exit;
        '
        # sshpass -p $pd ssh pms@192.168.11.$url '
        #     cd /home/pi/goview/static/;
        #     rm -rf /home/pi/goview/static/*;
        #     exit;
        # '
        echo "正在向 192.168.11.$url 传输..."
    #    sshpass -p $pd scp -q -r ../dist/* pi@192.168.11.$url:/home/pi/goview/static/
        sshpass -p $pd scp -q -r ../dist/* pms@192.168.11.$url:/install/goview/static/
        echo "192.168.11.$url 传输完成!"
    done

end=$(date +"%Y-%m-%d %H:%M:%S")

sys_start=$(date -d "$start" +%s)
sys_end=$(date -d "$end" +%s)

usetime=$((sys_end - sys_start))
time=$(date +%Y-%m-%d\ %H:%M:%S)

echo "上传完成"
echo "发布时间：$time"
echo "发布用时：$usetime s"
